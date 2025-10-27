
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

# # Setup basic logging
# logging.basicConfig(level=logging.INFO)
# logger = logging.getLogger(__name__)

# # Load .env
# env_path = Path(__file__).parent / ".env"
# load_dotenv(dotenv_path=env_path)

# # Initialize FastAPI
# app = FastAPI(title="AI Blog Generator API", version="1.0.0")

# # CORS - FIXED
# app.add_middleware(
#     CORSMiddleware,
#     allow_origins=["https://aiblog-generated.netlify.app"],  # Allow all origins
#     allow_credentials=True,
#     allow_methods=["*"],
#     allow_headers=["*"],
# )

# # Environment variables check - FIXED
# openai_api_key = os.getenv("OPENAI_API_KEY")
# supabase_url = os.getenv("SUPABASE_URL")
# supabase_service_key = os.getenv("SUPABASE_SERVICE_KEY")

# logger.info("Environment check - OpenAI Key: %s", "LOADED" if openai_api_key else "MISSING")
# logger.info("Environment check - Supabase URL: %s", "LOADED" if supabase_url else "MISSING")
# logger.info("Environment check - Supabase Key: %s", "LOADED" if supabase_service_key else "MISSING")

# # Initialize OpenAI - FIXED error handling
# try:
#     client = OpenAI(api_key=openai_api_key) if openai_api_key else None
#     if not client:
#         logger.warning("OpenAI client not initialized - API key missing")
# except Exception as e:
#     logger.error("OpenAI initialization failed: %s", e)
#     client = None

# # Initialize Supabase - FIXED error handling  
# try:
#     supabase: Client = create_client(supabase_url, supabase_service_key) if supabase_url and supabase_service_key else None
#     if not supabase:
#         logger.warning("Supabase client not initialized - credentials missing")
# except Exception as e:
#     logger.error("Supabase initialization failed: %s", e)
#     supabase = None

# # --- Template & system messages ---
# TEMPLATE_PROMPT = """
# You are an experienced marketing writer who has worked on real campaigns in {topic}.  
# Your job is to write a blog that feels genuinely human — conversational, story-driven, and emotionally real.  

# Write a blog post about **{topic}** in **{language}**.  

# ### VOICE & STYLE
# - Start with a **relatable, conversational hook** — a small story, observation, or emotion that draws readers in.  
# - Write like a person, not a company. Use contractions, pauses, and natural rhythm.  
# - Avoid robotic phrases or buzzwords like “cutting-edge technology,” “advanced solutions,” or “maximize ROI.”  
# - Replace generic lines with short examples or mini-scenarios.  
# - Avoid repeating the same idea or sentence pattern — vary your tone and flow.  
# - Keep it honest, grounded, and friendly, like you’re talking to a peer over coffee.  

# ### CONTENT DEPTH
# - Share **realistic, experience-based insights** — not just theory.  
# - Use believable examples (like small campaign stories, numbers, or outcomes).  
# - Explain the “why” behind tactics.  
# - Mention **{company_name}** naturally as part of the discussion, never as a pitch.  
# - Address common pain points readers face and show how to solve them.  

# ### STRUCTURE
# - Use **markdown headings** for structure.  
# - Keep paragraphs short (2–4 sentences).  
# - Use bullet lists for steps, tips, or comparisons.  
# - End with a **natural, reflective conclusion**, not a robotic summary.  

# ### HUMANIZATION TRIGGERS
# - Use light humor or honest asides (“let’s be real,” “I’ve seen this happen a dozen times”).  
# - Add relatable micro-stories or personal experiences.  
# - Vary rhythm — mix short punchy lines with longer reflective ones.  
# - Avoid mirrored phrasing and filler words.  
# - Keep it slightly imperfect; natural human tone is more believable.  

# ### SEO & READABILITY
# - Integrate **{topic}** smoothly — don’t overstuff keywords.  
# - Maintain a natural, easy-to-read tone with clear transitions.  
# - Focus on clarity and flow more than perfection.  

# ### OUTPUT RULES
# - Stick strictly to the topic.  
# - Format cleanly in **markdown**.  
# - Output must feel like a real human wrote it — emotional, smooth, and relatable.
# """


# SYSTEM_MESSAGE = """
# You are a senior marketing strategist and skilled storyteller.  
# Your goal is to generate blog content that reads as if written by a real person — confident, conversational, and grounded in lived experience.

# ### TONE & STYLE
# - Sound warm, genuine, and thoughtful.  
# - Start with a **natural hook** — something that feels human, not scripted.  
# - Use contractions (“you’re,” “it’s,” “we’ve”) for flow.  
# - Avoid robotic structure, overused phrases, or stiff transitions.  
# - Replace abstract claims with vivid examples or relatable moments.  
# - If possible, show real-life mini scenarios or personal lessons learned.

# ### CONTENT GUIDELINES
# - Stay fully on-topic: {topic}.  
# - Use practical, experience-driven advice — no fluff.  
# - Include believable data or outcomes where needed.  
# - Mention **{company_name}** naturally, never as a promotion.  
# - Keep tone helpful, smart, and human — not salesy or overly formal.

# ### HUMANIZER CUES
# - Mix sentence lengths; avoid symmetry.  
# - Use occasional pauses or asides (“you’d be surprised how often this happens”).  
# - Avoid perfect phrasing — a few natural imperfections make it real.  
# - No copy-paste sentence structures or mirrored transitions.  
# - Encourage curiosity or reflection at the end.

# ### QUALITY CHECKLIST
# 1. The tone feels like a real expert talking, not an AI summarizing.  
# 2. Writing flows naturally with emotional rhythm.  
# 3. The opening hook and examples sound lived, not fabricated.  
# 4. No repetitive language, filler, or corporate buzzwords.  
# 5. Each paragraph adds value or builds emotional connection.

# Your purpose:  
# Generate **authentic, human-quality marketing blogs** that pass AI detectors and engage readers emotionally and intellectually.
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
    
#     # 1. Title length check (2 points)
#     title_length = len(title)
#     if 50 <= title_length <= 60:
#         score += 2.0
#     elif 40 <= title_length <= 70:
#         score += 1.0
#     else:
#         score += 0.5
    
#     # 2. Content length check (3 points)
#     word_count = len(content.split())
#     if word_count >= 1000:
#         score += 3.0
#     elif word_count >= 700:
#         score += 2.5
#     elif word_count >= 500:
#         score += 2.0
#     elif word_count >= 300:
#         score += 1.5
#     else:
#         score += 0.5
    
#     # 3. Heading structure check (2 points)
#     h1_count = content.count('# ')
#     h2_count = content.count('## ')
    
#     if h1_count == 1:
#         score += 1.0
#     if h2_count >= 2:
#         score += 1.0
#     elif h2_count >= 1:
#         score += 0.5
    
#     # 4. Keyword optimization (3 points)
#     content_lower = content.lower()
#     title_lower = title.lower()
    
#     keyword_score = 0
#     for kw in keywords:
#         kw_lower = kw.lower().strip()
#         if kw_lower and len(kw_lower) > 2:
#             # Keyword in title
#             if kw_lower in title_lower:
#                 keyword_score += 0.5
            
#             # Keyword density in content
#             kw_count = content_lower.count(kw_lower)
#             if word_count > 0:
#                 kw_density = (kw_count / word_count) * 100
#                 if 1.0 <= kw_density <= 3.0:
#                     keyword_score += 0.3
#                 elif kw_density > 0:
#                     keyword_score += 0.1
    
#     score += min(keyword_score, 3.0)  # Max 3 points for keywords
    
#     # 5. Content quality bonus (1 point)
#     # Check for paragraph structure
#     paragraphs = content.split('\n\n')
#     if len(paragraphs) >= 5:
#         score += 0.5
    
#     # Check for list items (bullet points)
#     if '- ' in content or '* ' in content:
#         score += 0.5
    
#     return min(round(score, 1), max_score)  # Return rounded score

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
#         logger.info("Received /generate-blog request")
        
#         # Extract data with defaults - FIXED
#         topic = data.get("topic", "Default Topic")
#         company_name = data.get("company_name", "")
#         keywords = data.get("keywords", [])
#         word_count = data.get("word_count", 800)
#         tone = data.get("tone", "professional")
#         language = data.get("language", "English")
#         sample_blog = data.get("sample_blog")
#         company_url = data.get("company_url")
#         user_id = data.get("user_id")

#          # ✅ Safely handle template
#         template = data.get("template", None)
#         if template:
#             logger.info(f"Template received: {type(template)}")
#             # You can optionally store or log this template value
#             # If it’s a dict/object, convert to string for safety
#             if isinstance(template, dict):
#                 template = str(template)

#         # Build prompt - FIXED
#         prompt = TEMPLATE_PROMPT.format(
#             topic=topic,
#             company_name=company_name or " ",
#             word_count=word_count,
#             tone=tone,
#             language=language,
#             keywords=", ".join(keywords) if keywords else "relevant terms"
#         )

#         if sample_blog:
#             prompt += f"\n\nMatch this writing style:\n{sample_blog[:1500]}"
#         if company_url:
#             scraped = scrape_content_from_url(company_url)
#             if scraped:
#                 prompt += f"\n\nUse this as reference:\n{scraped}"

#         if template:
#             prompt += f"\n\nUse this writing template for style reference:\n{template}"


#         response = client.chat.completions.create(
#             model="gpt-4o-mini",  
#             messages=[
#                 {"role": "system", "content": SYSTEM_MESSAGE},
#                 {"role": "user", "content": prompt}
#             ],
#             max_tokens=2000,
#             temperature=1.0,
#             top_p=0.8,
#             presence_penalty=0.6, 
#             frequency_penalty=0.7
#         )

#         # Extract response - FIXED
#         if not response.choices:
#             raise HTTPException(status_code=500, detail="OpenAI returned no response")
        
#         generated_text = response.choices[0].message.content.strip()
        
#         if not generated_text:
#             raise HTTPException(status_code=500, detail="OpenAI returned empty content")

#         logger.info("Generated text length: %d", len(generated_text))

#         # Extract title - FIXED
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

#         # Save to Supabase - FIXED error handling
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

#         if supabase:
#             try:
#                 res = supabase.table("blogs").insert(blog_data).execute()
#                 if hasattr(res, 'data') and res.data:
#                     row = res.data[0]
#                     logger.info("Blog saved to Supabase: %s", row["id"])
#                 else:
#                     logger.warning("Supabase insert failed, returning blog without save")
#                     row = blog_data
#             except Exception as db_error:
#                 logger.error("Supabase error: %s", db_error)
#                 row = blog_data  # Return blog even if DB fails
#         else:
#             logger.warning("Supabase not available, returning blog without save")
#             row = blog_data

#         return row

#     except HTTPException:
#         raise
#     except Exception as e:
#         logger.exception("Unexpected error in /generate-blog")
#         raise HTTPException(status_code=500, detail=str(e))


# @app.get("/blogs/{blog_id}")
# async def get_blog(blog_id: str, user_id: str = None):
#     try:
#         if not supabase:
#             raise HTTPException(status_code=500, detail="Database not available")
            
#         query = supabase.table("blogs").select("*")
#         if user_id:
#             query = query.eq("user_id", user_id)
#         res = query.eq("id", blog_id).maybe_single().execute()
#         if not getattr(res, 'data', None):
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
#         if not url:
#             raise HTTPException(status_code=400, detail="URL required")
            
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
    
#     uvicorn.run(app, host="0.0.0.0", port=10000)



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
import functools
from typing import Any, Callable

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
    allow_origins=["https://aiblog-generated.netlify.app"],  # Allow all origins
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

# Safe iteration decorator
def safe_iteration_handler(func: Callable) -> Callable:
    """Decorator to safely handle iteration errors in API endpoints"""
    @functools.wraps(func)
    async def wrapper(*args, **kwargs):
        try:
            return await func(*args, **kwargs)
        except TypeError as e:
            if "not iterable" in str(e):
                logger.error(f"Iteration error in {func.__name__}: {e}")
                raise HTTPException(
                    status_code=422, 
                    detail=f"Invalid data format: {str(e)}"
                )
            raise
    return wrapper

# --- Template & system messages ---
TEMPLATE_PROMPT = """
You are an experienced marketing writer who has worked on real campaigns in {topic}.  
Your job is to write a blog post that feels genuinely human — conversational, emotionally real, and SEO-optimized.  

Write a blog post about **{topic}** in **{language}** with approximately **{word_count} words**, keeping every section closely aligned with the topic.

### VOICE & STYLE
- Begin with a relatable, conversational hook that connects personally to the blog’s topic or the reader’s core challenge.
- The opening should immediately introduce the main subject (for example: email list etc.).  
- Write like you're chatting with a smart friend — natural, fluid, and warm.  
- Use contractions and occasional pauses for rhythm.  
- Avoid robotic or repetitive phrases. Never use buzzwords like "leading-edge," "solutions," or "maximize ROI."  
- Keep flow dynamic: mix short, punchy lines with reflective thoughts.  
- Maintain natural flow between ideas; avoid sudden jumps or off-topic transitions.
- Use light humor or honesty ("let's be real," "you've probably seen this before").  

### CONTENT DEPTH & QUALITY
- Every paragraph should contribute meaningful or experience-based insight — no filler.  
- Use small campaign stories, sample numbers, or real insights where relevant.  
- Explain the **"why"** behind tactics clearly.  
- Mention **{company_name}** naturally once or twice in context, never as a promotion.  
- Keep paragraphs short for readability (max 3–4 lines).  

### STRUCTURE & LENGTH CONTROL
- Include an **SEO-friendly title** and clearly written **subheadings** — all directly relevant to {topic}.  
- Structure content to match the **{word_count}** target: adjust section depth accordingly.  
- For shorter word counts (500-800): focus on 3-4 key points with brief examples.
- For medium word counts (800-1200): include 5-6 sections with detailed explanations.
- For longer word counts (1200+): include 9-10 sections and add comprehensive examples, case studies, and actionable steps.
- Use **bullet points or numbered lists** where helpful.  
- End with a clear, **natural reflection or takeaway** (around 60–92 words) that summarizes the key takeaways and ties back directly to {topic}.

### SEO & READABILITY
- Write content that achieves a **high SEO score** while keeping a **human tone**.  
- Integrate **{topic}** and related keywords naturally — don't overstuff.  
- Ensure the title, headings, subheadings and paragraphs all align with the main topic.  
- Balance content depth with the specified word count range.  
- Keep sentence variation natural to improve AI-detection human score.

### HUMANIZATION TRIGGERS
- Add micro-stories or mini anecdotes to sound real.  
- Use natural imperfections and rhythm variations.  
- Avoid mirrored phrasing or repetitive line patterns.  
- Prioritize flow and emotion over perfect grammar — write like a real person would.

### OUTPUT RULES
- Target approximately **{word_count} words** — adjust content depth to match this requirement.
- Fully focus on the topic {topic}.  
- Avoid repeating any single word or phrase more than twice, unless naturally required.  
- Format properly in **markdown** using clear headings and spacing.  
- The result should feel high human on AI detection while keeping content quality high.

"""

SYSTEM_MESSAGE = """
You are a senior marketing strategist and human-style storyteller, skilled at writing SEO-rich blogs that connect emotionally with readers.  
Your task is to create content that sounds lived, genuine, and grounded — not like AI output.

### TONE & STYLE
- Start with a natural hook that feels real, not scripted — but make sure it clearly ties to the blog’s main topic or keyword.
- Write in a warm, genuine, conversational tone with sentence variety.
- Avoid robotic structure, symmetry, or corporate fluff.
- Use contractions and relatable asides for natural rhythm.
- Let the writing breathe — slight imperfections are human.


### CONTENT GUIDELINES
- Stay 100% on-topic to {topic}.  
- Write approximately **{word_count} words** — adjust section depth and examples to match this target.
- Maintain logical flow between title, headings, and content sections.  
- Use real or believable examples, not generic statements.  
- Mention **{company_name}** once or twice naturally as part of context.  
- Keep paragraphs concise but ensure total length matches the word count requirement.

### WORD COUNT ADAPTATION
- **Short posts (500-800 words)**: Focus on 3-4 core insights with brief, punchy examples.
- **Medium posts (800-1200 words)**: Include detailed explanations, multiple examples, and actionable tips.
- **Long posts (1200+ words)**: Add comprehensive sections, case studies, step-by-step guides, and thorough analysis.
- Always prioritize quality over quantity — better to be slightly under than add unnecessary filler.

### SEO & QUALITY CONTROL
- Ensure high SEO coherence — titles, headings, subheadings and text must all reinforce {topic}.  
- Balance SEO with natural tone; never force keywords.  
- Avoid repetition or mirrored sentence styles.  
- Keep readability high, human percentage high, and avoid over-polishing.
- Scale content complexity appropriately with word count requirements.

### HUMAN-LIKE TOUCHES
- Vary sentence lengths and rhythm.  
- Include small reflections or "real-life" style insights.  
- Avoid salesy or exaggerated claims; be grounded.
- Write content that would pass as being from an experienced human marketer.

Your purpose:  
Generate **SEO-friendly, human-sounding, topic-aligned blog posts** at the specified word count, optimized for GPT-4o-mini — fluent, emotionally intelligent writing that feels authentically written by a person while meeting exact length requirements.


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

def safe_ensure_list(data: Any) -> list:
    """Safely convert any data to a list without iteration errors"""
    if data is None:
        return []
    elif isinstance(data, list):
        return data
    elif isinstance(data, str):
        return [item.strip() for item in data.split(',') if item.strip()]
    elif hasattr(data, '__iter__') and not isinstance(data, (str, dict)):
        try:
            return list(data)
        except:
            return [str(data)]
    else:
        return [str(data)]

def calculate_seo_score(title, content, keywords):
    score = 0.0
    max_score = 10.0
    
    # SAFE KEYWORDS HANDLING
    safe_keywords = safe_ensure_list(keywords)
    
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
    if word_count >= 1200:
        score += 3.5 
    elif word_count >= 1000:
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
    h3_count = content.count('### ')
    
    if h1_count == 1:
        score += 1.0
    if h2_count >= 2:
        score += 1.0
    elif h2_count >= 1:
        score += 0.5
    if h3_count >= 1:
        score += 0.5
    
    # 4. Keyword optimization (3 points)
    content_lower = content.lower()
    title_lower = title.lower()
    
    keyword_score = 0
    for kw in safe_keywords:
        kw_lower = str(kw).lower().strip()
        if kw_lower and len(kw_lower) > 2:
            # Keyword in title
            if kw_lower in title_lower:
                keyword_score += 0.7
            
            # Keyword density in content
            kw_count = content_lower.count(kw_lower)
            if word_count > 0:
                kw_density = (kw_count / word_count) * 100
                if 1.0 <= kw_density <= 3.0:
                    keyword_score += 0.4
                elif 0 < kw_density < 1.0:
                    keyword_score += 0.2
                elif kw_density > 5.0:
                    keyword_score -= 0.5  # penalty

    
    score += min(keyword_score, 3.0)  # Max 3 points for keywords
    
    # 5. Content quality bonus (1 point)
    # Check for paragraph structure
    paragraphs = content.split('\n\n')
    if len(paragraphs) >= 7:
        score += 0.5
    
    # Check for list items (bullet points)
    if '- ' in content or '* ' in content:
        score += 0.5
    if '![' in content:
        score += 0.5,
    if 'http' in content or 'www.' in content:
        score += 0.5

    
    return min(round(score, 1), max_score)  # Return rounded score

def generate_meta_description(content, max_length=160):
    paragraphs = content.split("\n\n")
    first_para = paragraphs[0] if paragraphs else content[:200]
    clean = re.sub(r"[#*`]", "", first_para)
    return clean[:max_length-3] + "..." if len(clean) > max_length else clean

# --- Endpoints ---
@app.post("/generate-blog")
@safe_iteration_handler
async def generate_blog(request: Request):
    try:
        data = await request.json()
        logger.info("Received /generate-blog request")
        
        # DEBUG: Log data types to identify iteration issues
        logger.info("=== DEBUG DATA TYPES ===")
        logger.info(f"keywords type: {type(data.get('keywords'))}, value: {data.get('keywords')}")
        logger.info(f"template type: {type(data.get('template'))}, value: {data.get('template')}")
        logger.info("=== END DEBUG ===")
        
        # ✅ FIXED: Safe data extraction with iteration protection
        topic = data.get("topic", "Default Topic")
        company_name = data.get("company_name", "")
        word_count = data.get("word_count", 800)
        tone = data.get("tone", "professional")
        language = data.get("language", "English")
        sample_blog = data.get("sample_blog")
        company_url = data.get("company_url")
        user_id = data.get("user_id")

        # ✅ FIXED: Safe keywords handling
        raw_keywords = data.get("keywords")
        keywords = safe_ensure_list(raw_keywords)

        # ✅ FIXED: Safe template handling
        template = data.get("template")
        template_str = None
        if template:
            logger.info(f"Template received: {type(template)}")
            try:
                if isinstance(template, (dict, list)):
                    template_str = str(template)
                else:
                    template_str = str(template)
            except Exception as e:
                logger.warning(f"Template conversion failed: {e}")
                template_str = None

        # Build prompt - FIXED
        prompt = TEMPLATE_PROMPT.format(
            topic=topic,
            company_name=company_name or " ",
            word_count=word_count,
            template = template,
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

        if template_str:
            prompt += f"\n\nUse this writing template for style reference:\n{template_str}"

        # Check if OpenAI client is available
        if not client:
            raise HTTPException(status_code=500, detail="OpenAI client not configured")

        response = client.chat.completions.create(
            model="gpt-4o-mini",  
            messages=[
                {"role": "system", "content": SYSTEM_MESSAGE},
                {"role": "user", "content": prompt}
            ],
            max_tokens=2000,
            temperature=1.0,
            top_p=0.8,
            presence_penalty=0.6, 
            frequency_penalty=0.7
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

        seo_score = calculate_seo_score(title, content, keywords)
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
            "keywords_used": keywords,
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
                # SAFE response handling
                if res and hasattr(res, 'data'):
                    if isinstance(res.data, list) and len(res.data) > 0:
                        row = res.data[0]
                        logger.info("Blog saved to Supabase: %s", row["id"])
                    else:
                        # If no data returned, use our local data
                        logger.warning("Supabase returned empty data, using local blog data")
                        row = blog_data
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
        
        # SAFE response handling
        if not res or not hasattr(res, 'data') or not res.data:
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
        
        # SAFE iteration for links and images
        links = []
        images = []
        try:
            links = [a["href"] for a in soup.find_all("a", href=True)][:20]
        except Exception as e:
            logger.warning(f"Error extracting links: {e}")
        
        try:
            images = [img["src"] for img in soup.find_all("img", src=True)][:10]
        except Exception as e:
            logger.warning(f"Error extracting images: {e}")
            
        return {"url": url, "title": title, "content": content[:2000], "links": links, "images": images}
    except Exception as e:
        logger.exception("Error in /scrape-content")
        raise HTTPException(status_code=500, detail=str(e))

@app.get("/health")
async def health_check():
    return {"status": "healthy", "message": "API running"}

if __name__ == "__main__":
    uvicorn.run(app, host="0.0.0.0", port=8000)