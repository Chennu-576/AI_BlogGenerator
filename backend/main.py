
from fastapi import FastAPI, HTTPException, Request
from fastapi.middleware.cors import CORSMiddleware
from openai import OpenAI
import os
from bs4 import BeautifulSoup
import requests
import re
from dotenv import load_dotenv
from pathlib import Path
from supabase import create_client, Client
from datetime import datetime
import uvicorn
import logging

# Setup basic logging
logging.basicConfig(level=logging.INFO)
logger = logging.getLogger(__name__)

# Load .env
env_path = Path(__file__).parent / ".env"
load_dotenv(dotenv_path=env_path)

# Initialize FastAPI
app = FastAPI(title="AI Blog Generator API", version="1.0.0")

# CORS - FIXED
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],  # Allow all origins
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Environment variables check - FIXED
openai_api_key = os.getenv("OPENAI_API_KEY")
supabase_url = os.getenv("SUPABASE_URL")
supabase_service_key = os.getenv("SUPABASE_SERVICE_KEY")

logger.info("Environment check - OpenAI Key: %s", "LOADED" if openai_api_key else "MISSING")
logger.info("Environment check - Supabase URL: %s", "LOADED" if supabase_url else "MISSING")
logger.info("Environment check - Supabase Key: %s", "LOADED" if supabase_service_key else "MISSING")

# Initialize OpenAI - FIXED error handling
try:
    client = OpenAI(api_key=openai_api_key) if openai_api_key else None
    if not client:
        logger.warning("OpenAI client not initialized - API key missing")
except Exception as e:
    logger.error("OpenAI initialization failed: %s", e)
    client = None

# Initialize Supabase - FIXED error handling  
try:
    supabase: Client = create_client(supabase_url, supabase_service_key) if supabase_url and supabase_service_key else None
    if not supabase:
        logger.warning("Supabase client not initialized - credentials missing")
except Exception as e:
    logger.error("Supabase initialization failed: %s", e)
    supabase = None

# --- Template & system messages ---
TEMPLATE_PROMPT = """
You are a senior marketing consultant who has worked directly with real campaigns in {topic}. 
Your job is to write a blog post that feels unmistakably human — conversational, story-driven, and emotionally intelligent.

Write a blog about {topic} in {language} for exactly {word_count} words.

VOICE & STYLE:
- Begin with a **compelling, conversational hook** — a relatable story, honest moment, or surprising observation.
- Write like a real person, not a corporate writer. Use contractions, natural pauses, and rhythm shifts.
- Avoid robotic phrases or buzzwords like “advanced algorithms,” “cutting-edge solutions,” or “maximize ROI.”
- Let it sound slightly imperfect — like genuine thoughts, not polished marketing copy.
- Add **mini-scenarios or anecdotes** from real-world experience to make your points believable.
- Vary sentence length: mix short, punchy lines with longer reflective ones.

CONTENT DEPTH:
- Share **realistic, experience-based insights** from marketing or business practice.
- Use **credible but plausible metrics** (e.g., “CTR jumped from 2.8% to 5.1%”).
- Explain **why** things work, not just what to do.
- Include **specific examples or frameworks** readers can use.
- Address common **pain points marketers face** and how to fix them.
- Mention {company_name} naturally as part of the insight (never salesy).

STRUCTURE:
- Use bold markdown **headings** for sections.
- Keep paragraphs short (2–4 sentences each).
- Add **bullet lists** for frameworks, takeaways, or comparisons.
- End with a **bold, reflective Conclusion** section — not robotic, just natural closure.

HUMANIZATION TRIGGERS:
- Use light humor or personality (“been there, done that,” “let’s be honest…”).
- Occasionally break the flow with conversational pauses or asides.
- Avoid repetitive sentence starts or mirrored phrasing.
- Keep emotional tone authentic — like an expert who still sounds human.

SEO & READABILITY:
- Integrate {topic} smoothly into the content (no keyword stuffing).
- Keep tone clear, friendly, and smart — like you’re talking to a professional peer.
- Prioritize flow and believability over perfection.

OUTPUT RULES:
- Stick strictly to {topic}.
- Format everything in **markdown**.
- Produce natural, human-like text that feels authentic, readable, and emotionally real.
"""


SYSTEM_MESSAGE = """
You are a senior marketing strategist with hands-on experience in {topic}.
Your job is to create blog content that reads as if written by a human consultant — 
warm, reflective, and grounded in real marketing practice.

TONE & STYLE:
- Sound conversational, confident, and honest.
- Start with a natural **hook** — something relatable, not formal.
- Use contractions (“you’re,” “it’s,” “we’ve”) and informal rhythm.
- Avoid robotic or repetitive language.
- Replace generic corporate words with plain, expressive phrasing.

CONTENT GUIDELINES:
- Stick closely to {topic} and speak from experience.
- Include real-world examples or plausible mini-stories that make your insights feel lived-in.
- Use **believable data points** (percentages, campaign outcomes, etc.).
- Mention {company_name} naturally where relevant, but never as a pitch.
- Share **practical advice, steps, or mini frameworks** that add value.

FORMATTING:
- Use bold markdown **headings**.
- Keep paragraphs short and readable.
- Use **bullet lists** for clarity and flow.
- End with a brief, human-sounding **Conclusion** that feels reflective, not mechanical.

HUMANIZER CUES:
- Vary sentence rhythm — mix long reflective lines with short, direct ones.
- Insert small asides (“you’d be surprised how often this happens”).
- Allow imperfections or conversational detours — that’s what makes it human.
- No repetition of phrasing or structure between paragraphs.

QUALITY CHECKLIST:
1. Avoid robotic phrasing and filler adjectives.
2. Maintain emotional warmth and narrative flow.
3. Use natural rhythm, slight asymmetry, and believable insight.
4. Output must look like it came from a real person, not a machine.

Purpose: Generate **undetectably human marketing blogs** for the AI Blog Generator — 
content that feels real, reads smoothly, and passes AI detection tools naturally.
"""

# --- Helper functions ---
def scrape_content_from_url(url: str) -> str:
    try:
        res = requests.get(url, timeout=10, headers={"User-Agent": "Mozilla/5.0"})
        res.raise_for_status()
        soup = BeautifulSoup(res.text, "html.parser")
        for s in soup(["script", "style"]):
            s.decompose()
        return " ".join(p.get_text() for p in soup.find_all("p"))[:2000]
    except Exception as e:
        logger.warning(f"Scrape error for {url}: {e}")
        return ""

def calculate_seo_score(title, content, keywords):
    score = 0.0
    max_score = 10.0
    
    # 1. Title length check (2 points)
    title_length = len(title)
    if 50 <= title_length <= 60:
        score += 2.0
    elif 40 <= title_length <= 70:
        score += 1.0
    else:
        score += 0.5
    
    # 2. Content length check (3 points)
    word_count = len(content.split())
    if word_count >= 1000:
        score += 3.0
    elif word_count >= 700:
        score += 2.5
    elif word_count >= 500:
        score += 2.0
    elif word_count >= 300:
        score += 1.5
    else:
        score += 0.5
    
    # 3. Heading structure check (2 points)
    h1_count = content.count('# ')
    h2_count = content.count('## ')
    
    if h1_count == 1:
        score += 1.0
    if h2_count >= 2:
        score += 1.0
    elif h2_count >= 1:
        score += 0.5
    
    # 4. Keyword optimization (3 points)
    content_lower = content.lower()
    title_lower = title.lower()
    
    keyword_score = 0
    for kw in keywords:
        kw_lower = kw.lower().strip()
        if kw_lower and len(kw_lower) > 2:
            # Keyword in title
            if kw_lower in title_lower:
                keyword_score += 0.5
            
            # Keyword density in content
            kw_count = content_lower.count(kw_lower)
            if word_count > 0:
                kw_density = (kw_count / word_count) * 100
                if 1.0 <= kw_density <= 3.0:
                    keyword_score += 0.3
                elif kw_density > 0:
                    keyword_score += 0.1
    
    score += min(keyword_score, 3.0)  # Max 3 points for keywords
    
    # 5. Content quality bonus (1 point)
    # Check for paragraph structure
    paragraphs = content.split('\n\n')
    if len(paragraphs) >= 5:
        score += 0.5
    
    # Check for list items (bullet points)
    if '- ' in content or '* ' in content:
        score += 0.5
    
    return min(round(score, 1), max_score)  # Return rounded score

def generate_meta_description(content, max_length=160):
    paragraphs = content.split("\n\n")
    first_para = paragraphs[0] if paragraphs else content[:200]
    clean = re.sub(r"[#*`]", "", first_para)
    return clean[:max_length-3] + "..." if len(clean) > max_length else clean

# --- Endpoints ---
@app.post("/generate-blog")
async def generate_blog(request: Request):
    try:
        data = await request.json()
        logger.info("Received /generate-blog request")
        
        # Extract data with defaults - FIXED
        topic = data.get("topic", "Default Topic")
        company_name = data.get("company_name", "")
        keywords = data.get("keywords", [])
        word_count = data.get("word_count", 800)
        tone = data.get("tone", "professional")
        language = data.get("language", "English")
        sample_blog = data.get("sample_blog")
        company_url = data.get("company_url")
        user_id = data.get("user_id")

        # Build prompt - FIXED
        prompt = TEMPLATE_PROMPT.format(
            topic=topic,
            company_name=company_name or " ",
            word_count=word_count,
            tone=tone,
            language=language,
            keywords=", ".join(keywords) if keywords else "relevant terms"
        )

        if sample_blog:
            prompt += f"\n\nMatch this writing style:\n{sample_blog[:1500]}"
        if company_url:
            scraped = scrape_content_from_url(company_url)
            if scraped:
                prompt += f"\n\nUse this as reference:\n{scraped}"


        response = client.chat.completions.create(
            model="gpt-4o-mini",  
            messages=[
                {"role": "system", "content": SYSTEM_MESSAGE},
                {"role": "user", "content": prompt}
            ],
            max_tokens=2000,
            temperature=1.0,
            top_p=0.8
        )

        # Extract response - FIXED
        if not response.choices:
            raise HTTPException(status_code=500, detail="OpenAI returned no response")
        
        generated_text = response.choices[0].message.content.strip()
        
        if not generated_text:
            raise HTTPException(status_code=500, detail="OpenAI returned empty content")

        logger.info("Generated text length: %d", len(generated_text))

        # Extract title - FIXED
        match = re.search(r"^#\s+(.*)", generated_text, re.MULTILINE)
        if match:
            title = match.group(1).strip()
            content = re.sub(r"^#\s+.*\n", "", generated_text, count=1, flags=re.MULTILINE).strip()
        else:
            title = topic
            content = generated_text

        seo_score = calculate_seo_score(title, content, keywords or [])
        meta_description = generate_meta_description(content)
        word_count_calc = len(content.split())

        # Save to Supabase - FIXED error handling
        blog_data = {
            "title": title,
            "topic": topic,
            "content": content,
            "word_count": word_count_calc,
            "seo_score": round(seo_score),
            "meta_description": meta_description,
            "keywords_used": keywords or [],
            "template": "general",
            "tone": tone,
            "language": language,
            "company_name": company_name,
            "status": "published",
            "user_id": user_id,
            "created_at": datetime.utcnow().isoformat()
        }

        if supabase:
            try:
                res = supabase.table("blogs").insert(blog_data).execute()
                if hasattr(res, 'data') and res.data:
                    row = res.data[0]
                    logger.info("Blog saved to Supabase: %s", row["id"])
                else:
                    logger.warning("Supabase insert failed, returning blog without save")
                    row = blog_data
            except Exception as db_error:
                logger.error("Supabase error: %s", db_error)
                row = blog_data  # Return blog even if DB fails
        else:
            logger.warning("Supabase not available, returning blog without save")
            row = blog_data

        return row

    except HTTPException:
        raise
    except Exception as e:
        logger.exception("Unexpected error in /generate-blog")
        raise HTTPException(status_code=500, detail=str(e))


@app.get("/blogs/{blog_id}")
async def get_blog(blog_id: str, user_id: str = None):
    try:
        if not supabase:
            raise HTTPException(status_code=500, detail="Database not available")
            
        query = supabase.table("blogs").select("*")
        if user_id:
            query = query.eq("user_id", user_id)
        res = query.eq("id", blog_id).maybe_single().execute()
        if not getattr(res, 'data', None):
            raise HTTPException(status_code=404, detail="Blog not found")
        return res.data
    except Exception as e:
        logger.exception("Error in /blogs/{id}")
        raise HTTPException(status_code=500, detail=str(e))

@app.post("/scrape-content")
async def scrape_content(request: Request):
    try:
        data = await request.json()
        url = data.get("url")
        if not url:
            raise HTTPException(status_code=400, detail="URL required")
            
        res = requests.get(url, headers={"User-Agent": "Mozilla/5.0"}, timeout=10)
        res.raise_for_status()
        soup = BeautifulSoup(res.content, "html.parser")
        for s in soup(["script", "style"]):
            s.decompose()
        title = soup.find("title").get_text() if soup.find("title") else ""
        content = "\n".join(line.strip() for line in soup.get_text().splitlines() if line.strip())
        links = [a["href"] for a in soup.find_all("a", href=True)][:20]
        images = [img["src"] for img in soup.find_all("img", src=True)][:10]
        return {"url": url, "title": title, "content": content[:2000], "links": links, "images": images}
    except Exception as e:
        logger.exception("Error in /scrape-content")
        raise HTTPException(status_code=500, detail=str(e))

@app.get("/health")
async def health_check():
    return {"status": "healthy", "message": "API running"}

if __name__ == "__main__":
    
    uvicorn.run(app, host="0.0.0.0", port=10000)
