
# from fastapi import FastAPI, HTTPException, Request
# from fastapi.middleware.cors import CORSMiddleware
# from openai import OpenAI
# import os
# from bs4 import BeautifulSoup
# import requests
# import re
# from dotenv import load_dotenv
# from pathlib import Path
# from supabase import create_client, Client
# from datetime import datetime
# import uvicorn
# import logging

# # setup basic logging
# logging.basicConfig(level=logging.INFO)
# logger = logging.getLogger("ai-blog")

# # Load .env
# env_path = Path(__file__).parent / ".env"
# load_dotenv(dotenv_path=env_path)

# # Initialize FastAPI
# app = FastAPI(title="AI Blog Generator API", version="1.0.0")

# # CORS
# app.add_middleware(
#     CORSMiddleware,
#     allow_origins=["http://localhost:3000", "https://aiblog-generated.netlify.app"],
#     allow_credentials=True,
#     allow_methods=["*"],
#     allow_headers=["*"],
# )

# # OpenAI

# client = OpenAI(api_key=os.getenv("OPENAI_API_KEY"))
# # if not openai.api_key:
# #     raise ValueError("OpenAI API key not set. Add it in .env file.")
# logger.info("OpenAI key found (hidden)")

# # Supabase
# SUPABASE_URL = os.getenv("SUPABASE_URL")
# SUPABASE_SERVICE_KEY = os.getenv("SUPABASE_SERVICE_KEY")
# if not SUPABASE_URL or not SUPABASE_SERVICE_KEY:
#     logger.warning("Supabase URL or service key missing — DB operations will fail")
# supabase: Client = create_client(SUPABASE_URL, SUPABASE_SERVICE_KEY)

# # --- Template & system messages (AS STRINGS) ---
# TEMPLATE_PROMPT = """
# Write a comprehensive blog post about {topic} in {language}.
# Target word count: {word_count} words.
# Tone: {tone}
# Company: {company_name}  # <-- make sure this is passed from your frontend

# Choose the style based on context or user preference: 
# - General informative blog
# - Product review
# - Listicle
# - How-to guide
# - Press release

# Structure the blog with the following guidelines:

# 1. **Title (H1)**:
#    - Engaging and attention-grabbing.
#    - Include main keyword naturally.
#    - Include {company_name} if it fits organically.

# 2. **Introduction**:
#    - Start with a hook, problem, or relatable scenario.
#    - Mention {company_name} naturally if relevant.
#    - Clearly state the solution or purpose of the blog.

# 3. **Body (H2 Headings)**:
#    - Each section should have a clear H2 heading.
#    - Include detailed content, examples, stats, or case studies.
#    - Mention {company_name} at least thrice in the body in a natural context.
#    - Use bullet points or numbered lists where applicable.
#    - Maintain professional, human-like tone with occasional conversational phrases.
#    - Naturally integrate keywords: {keywords}.
#    - Provide actionable insights for readers.

# 4. **Optional Extras**:
#    - <h2> for “FAQ” heading.
#    -<h3> for each question.
#    -<p> for answers (default text size).
#    -Include 3–5 common Q&As.
#    -Suggest visuals (tables, charts, or highlight boxes) for key points.
#    -Use bold or italics for emphasis.

# 5. **Conclusion**:
#    - Summarize key takeaways.
#    - Include a strong call-to-action (CTA) mentioning {company_name} if suitable.
# """

# SYSTEM_MESSAGE = """
# You are an expert human content writer and SEO strategist.
# Your job is to write blog posts that feel 70% human-written.
# Guidelines:
# - H1 only for the main title; H2 for all sections.
# - Use short paragraphs (2–4 sentences) for readability.
# - Avoid robotic tone, repetition, or filler content.
# - Ensure proper keyword usage without stuffing.
# - Add light personality or conversational tone where appropriate.
# - Optimize for SEO naturally (heading hierarchy, keyword placement, readability).

# Output format: Plain text or Markdown only.
# """

# # --- Helper functions ---
# def scrape_content_from_url(url: str) -> str:
#     try:
#         res = requests.get(url, timeout=10, headers={"User-Agent": "Mozilla/5.0"})
#         res.raise_for_status()
#         soup = BeautifulSoup(res.text, "html.parser")
#         for s in soup(["script", "style"]):
#             s.decompose()
#         return " ".join(p.get_text() for p in soup.find_all("p"))[:2000]
#     except Exception as e:
#         logger.warning(f"Scrape error for {url}: {e}")
#         return ""

# def calculate_seo_score(title, content, keywords):
#     score = 0.0
#     max_score = 10.0
#     if 50 <= len(title) <= 60:
#         score += 1.5
#     elif 40 <= len(title) <= 70:
#         score += 1.0
#     word_count = len(content.split())
#     if word_count >= 300:
#         score += 1.5
#         if word_count >= 800:
#             score += 0.5
#     if content.count("# ") == 1:
#         score += 1.0
#     if content.count("## ") >= 3:
#         score += 1.0
#     content_lower = content.lower()
#     title_lower = title.lower()
#     for kw in keywords:
#         if kw.lower() in title_lower:
#             score += 0.5
#         kw_count = content_lower.count(kw.lower())
#         kw_density = (kw_count / word_count) * 100 if word_count else 0
#         if 1 <= kw_density <= 3:
#             score += 0.5
#     score += 1.0
#     return min(score, max_score)

# def generate_meta_description(content, max_length=160):
#     paragraphs = content.split("\n\n")
#     first_para = paragraphs[0] if paragraphs else content[:200]
#     clean = re.sub(r"[#*`]", "", first_para)
#     return clean[:max_length-3] + "..." if len(clean) > max_length else clean

# # --- Endpoints ---
# @app.post("/generate-blog")
# async def generate_blog(request: Request):
#     try:
#         data = await request.json()
#         logger.info("Received /generate-blog payload keys: %s", list(data.keys()))
#         topic = data.get("topic", "Default Topic")
#         company_name = data.get("company_name", "")
#         keywords = data.get("keywords", [])
#         word_count = data.get("word_count", 800)
#         tone = data.get("tone", "professional")
#         language = data.get("language", "English")
#         sample_blog = data.get("sample_blog")
#         company_url = data.get("company_url")
#         user_id = data.get("user_id")

#         # Build prompt
#         prompt = TEMPLATE_PROMPT.format(
#             topic=topic,
#             company_name=company_name or " ",
#             word_count=word_count,
#             tone=tone,
#             language=language,
#             keywords=", ".join(keywords) if keywords else "relevant industry terms"
#         )

#         if sample_blog:
#             prompt += f"\n\nMatch the writing style:\n'''{sample_blog[:1500]}'''\n"
#         if company_url:
#             scraped = scrape_content_from_url(company_url)
#             if scraped:
#                 prompt += f"\n\nTake inspiration:\n'''{scraped}'''\n"

#         prompt += "\nUse H1 for title and H2 for headings. Markdown only."
#         logger.info("Prompt length: %d chars", len(prompt))

#         # OpenAI call (robust)
#         response = client.chat.completions.create(
#             model="gpt-4o-mini",
#             messages=[
#                 {"role": "system", "content": SYSTEM_MESSAGE},
#                 {"role": "user", "content": prompt}
#             ],
#             max_tokens=2000,
#             temperature=0.7
#         )

#         # Extract generated text robustly
#         generated_text = None
#         try:
#             generated_text = response["choices"][0]["message"]["content"].strip()
#         except Exception:
#             try:
#                 # fallback to attribute access
#                 generated_text = response.choices[0].message.content.strip()
#             except Exception as ex:
#                 logger.error("Unable to read OpenAI response: %s", ex)
#                 raise HTTPException(status_code=500, detail="OpenAI returned unexpected response")

#         logger.info("Generated text length: %d", len(generated_text))

#         # Extract title
#         match = re.search(r"^#\s+(.*)", generated_text, re.MULTILINE)
#         if match:
#             title = match.group(1).strip()
#             content = re.sub(r"^#\s+.*\n", "", generated_text, count=1, flags=re.MULTILINE).strip()
#         else:
#             title = topic
#             content = generated_text

#         seo_score = calculate_seo_score(title, content, keywords or [])
#         meta_description = generate_meta_description(content)
#         word_count_calc = len(content.split())

#         # Save to Supabase
#         blog_data = {
#             "title": title,
#             "topic": topic,
#             "content": content,
#             "word_count": word_count_calc,
#             "seo_score": round(seo_score),
#             "meta_description": meta_description,
#             "keywords_used": keywords or [],
#             "template": "general",
#             "tone": tone,
#             "language": language,
#             "company_name": company_name,
#             "status": "published",
#             "user_id": user_id,
#             "created_at": datetime.utcnow().isoformat()
#         }

#         res = supabase.table("blogs").insert(blog_data, returning="representation").execute()
#         logger.info("Supabase insert result: %s", getattr(res, "status_code", "no-status"))
#         if not getattr(res, "data", None):
#             # include res in error to help debugging
#             raise HTTPException(status_code=500, detail=f"Failed to insert blog into Supabase. Raw response: {res}")

#         row = res.data[0]
#         return row

#     except HTTPException:
#         raise
#     except Exception as e:
#         logger.exception("Error in /generate-blog")
#         raise HTTPException(status_code=500, detail=str(e))


# @app.get("/blogs/{blog_id}")
# async def get_blog(blog_id: str, user_id: str = None):
#     try:
#         query = supabase.table("blogs").select("*")
#         if user_id:
#             query = query.eq("user_id", user_id)
#         res = query.eq("id", blog_id).maybe_single().execute()
#         if not getattr(res, "data", None):
#             raise HTTPException(status_code=404, detail="Blog not found")
#         return res.data
#     except Exception as e:
#         logger.exception("Error in /blogs/{id}")
#         raise HTTPException(status_code=500, detail=str(e))


# @app.post("/scrape-content")
# async def scrape_content(request: Request):
#     try:
#         data = await request.json()
#         url = data.get("url")
#         res = requests.get(url, headers={"User-Agent": "Mozilla/5.0"}, timeout=10)
#         res.raise_for_status()
#         soup = BeautifulSoup(res.content, "html.parser")
#         for s in soup(["script", "style"]):
#             s.decompose()
#         title = soup.find("title").get_text() if soup.find("title") else ""
#         content = "\n".join(line.strip() for line in soup.get_text().splitlines() if line.strip())
#         links = [a["href"] for a in soup.find_all("a", href=True)][:20]
#         images = [img["src"] for img in soup.find_all("img", src=True)][:10]
#         return {"url": url, "title": title, "content": content[:2000], "links": links, "images": images}
#     except Exception as e:
#         logger.exception("Error in /scrape-content")
#         raise HTTPException(status_code=500, detail=str(e))


# @app.get("/health")
# async def health_check():
#     return {"status": "healthy", "message": "API running"}


# if __name__ == "__main__":
#     uvicorn.run(app, host="0.0.0.0", port=8000)


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
You are a senior marketing consultant with years of hands-on experience running campaigns in {topic}. For the AI Blog Generator, your goal is to write a blog that feels unmistakably human — conversational, emotionally aware, and filled with lived experience.

Write a blog about {topic} in {language} for exactly {word_count} words.

---

### VOICE & STYLE:
- Start with a **hook that feels human and natural** — a relatable question, quick story, small confession, or surprising insight.
- Sound **authentic and fallible** — use contractions (“you’re”, “it’s”), small pauses (“honestly…”, “you know what I mean?”), and rhetorical questions.
- Avoid formal or robotic words like “cutting-edge”, “advanced algorithms”, or “innovative strategies”.
- Keep rhythm varied — mix short and long sentences, occasional fragments, even a pause or two.
- Use **mini-scenarios, campaign anecdotes, or relatable examples** — make it feel lived, not scripted.
- Write like you’re talking to a smart friend or client over coffee.

---

### INSIGHT CONTENT:
- Share **real-world marketing insights** — mention what you’ve seen work or fail in campaigns.
- Use **believable data points** (CTR lifts, conversion improvements, engagement changes) to anchor the story.
- Talk about **real pain points** marketers face and how they can fix them.
- Suggest **specific actions, short frameworks, or checklists** readers can use.
- Mention {company_name} naturally as part of the context or solution — never in a salesy way.

---

### STRUCTURE:
- Use bold **markdown headings** for each section.
- Keep paragraphs short — 2 to 4 sentences max.
- Use **bullet points** for actionable steps, comparisons, or takeaways.
- End with a **bold Conclusion** section that wraps up insights conversationally and encourages reflection.

---

### HUMANIZER ADDITIONS:
- Sprinkle in idioms or natural remarks (“been there”, “let’s be honest”, “it’s not as easy as it sounds…”).
- Include small reflections or self-aware comments to break AI rhythm.
- Allow small imperfections — a half-thought, a pause, a change in tone.
- Vary sentence lengths and transitions to sound spontaneous and alive.

---

### SEO & READABILITY:
- Integrate {topic} naturally; never repeat keywords unnaturally.
- Focus on clarity, warmth, and grounded expertise.
- Forget corporate talk — sound like a consultant who’s genuinely trying to help.

---

### OUTPUT RULES:
- Stay 100% on {topic}.
- Format the blog using **markdown headings** and readable structure.
- Word count: exactly {word_count}.
- The writing must feel **human-written**, emotionally aware, and experience-driven — never AI-generated.
"""


SYSTEM_MESSAGE = """
You are an experienced marketing consultant who speaks from personal experience in {topic}. Your job is to generate blog content that sounds genuinely human — imperfect rhythm, conversational tone, emotional intelligence, and practical insights.

---

### STYLE & TONE:
- Talk like a real marketer — confident but casual, thoughtful but not robotic.
- Use contractions, idioms, and rhetorical pauses (“here’s the thing…”, “funny enough…”, “you’d be surprised…”).
- Avoid symmetry and formulaic phrasing; vary tone and rhythm like natural speech.
- Add small human touches — side notes, opinions, and small realizations.
- Keep the tone warm, reflective, and grounded in real-world practice.

---

### CONTENT RULES:
- Focus entirely on {topic} — don’t drift.
- Include **credible, realistic benchmarks** (CTR ranges, ROI changes, etc.).
- Mention {company_name} naturally — never in a promotional tone.
- Offer **specific, actionable marketing steps** or frameworks drawn from personal experience.
- Support ideas with plausible examples or mini case studies from past campaigns.

---

### STRUCTURE:
- Use bold markdown **headings**.
- Keep paragraphs short: 2–4 sentences.
- Use **bullet points** for steps, comparisons, or examples.
- Transition naturally using phrases like “On the flip side…”, “Zooming out…”, “Let’s break it down…”, or “Here’s what I’ve noticed…”.

---

### HUMANIZER CUES:
- Add relatable idioms (“been there”, “not my first rodeo”) or small asides (“trust me, I’ve tried…”).
- Allow slight rhythm imperfections — short bursts, pauses, occasional fragments.
- Avoid over-polishing — small irregularities make it feel real.
- Use grounded, believable examples — like campaign results, email performance, or real marketing team observations.

---

### QUALITY FILTERS:
1. No repetition or filler language.
2. Maintain conversational, active tone — avoid corporate or academic phrasing.
3. Keep flow uneven and authentic — not perfectly balanced or robotic.
4. Use realistic context, data, and examples to make the blog feel lived-in.
5. Ensure markdown formatting, readability, and topic depth.

Purpose: Write **undetectably human blogs** that sound like they were written by real marketing consultants who’ve actually done the work — not by AI.
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
            model="gpt-3.5-turbo",  
            messages=[
                {"role": "system", "content": SYSTEM_MESSAGE},
                {"role": "user", "content": prompt}
            ],
            max_tokens=2000,
            temperature=0.8
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
