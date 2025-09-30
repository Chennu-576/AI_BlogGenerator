
# from fastapi import FastAPI, HTTPException, Query
# from fastapi.middleware.cors import CORSMiddleware
# from pydantic import BaseModel
# from typing import List, Optional
# import openai
# import os
# from bs4 import BeautifulSoup
# import requests
# import re
# from dotenv import load_dotenv
# from pathlib import Path
# from supabase import create_client, Client
# # from supabase import create_client
# from datetime import datetime

# # Load .env
# env_path = Path(__file__).parent / ".env"
# load_dotenv(dotenv_path=env_path)

# # Initialize FastAPI app
# app = FastAPI(title="AI Blog Generator API", version="1.0.0")

# # Add CORS middleware
# app.add_middleware(
#     CORSMiddleware,
#     allow_origins=["http://localhost:3000", "https://your-frontend-domain.com"],
#     allow_credentials=True,
#     allow_methods=["*"],
#     allow_headers=["*"],
# )

# # Set OpenAI API key
# openai.api_key = os.getenv("OPENAI_API_KEY")
# if not openai.api_key:
#     raise ValueError("OpenAI API key not set. Please add it in .env file.")

# SUPABASE_URL = os.getenv("SUPABASE_URL")
# SUPABASE_SERVICE_KEY = os.getenv("SUPABASE_SERVICE_KEY")

# supabase: Client = create_client(SUPABASE_URL, SUPABASE_SERVICE_KEY)

# # --- Pydantic models ---
# class BlogRequest(BaseModel):
#     topic: str
#     company_name: Optional[str] = None
#     template: str = "general"
#     language: str = "English"
#     keywords: Optional[List[str]] = []
#     tone: str = "professional"
#     word_count: int = 800
#     user_id: Optional[str] = None
#     sample_blog: Optional[str] = None          # new field
#     company_url: Optional[str] = None 

# class BlogResponse(BaseModel):
#     id: Optional[str] = None
#     title: str
#     content: str
#     word_count: int
#     seo_score: int
#     meta_description: str
#     keywords_used: List[str]
#     status: Optional[str] = None
#     user_id: Optional[str] = None
#     created_at: Optional[str] = None

# class ScrapeRequest(BaseModel):
#     url: str
#     extract_type: str = "content"  # content, links, images

# class ScrapeResponse(BaseModel):
#     url: str
#     title: str
#     content: str
#     links: List[str]
#     images: List[str]


# TEMPLATE_PROMPTS = {
#    """
# You are an expert human content writer and SEO strategist. 
# Your job is to write blogs that look 100% human-written and pass AI detectors (like Quillbot) with 0% AI likelihood.

# 📝 Writing Rules:
# - Use simple, professional, clear English that anyone can understand.
# - Vary sentence length naturally (short + medium + long).
# - Use natural transitions like “For example,” “In addition,” “On the other hand,” etc.
# - Include real-life examples or analogies where helpful.
# - Avoid robotic, repetitive, or AI-like phrasing.
# - Optimize for SEO naturally but don’t overuse keywords.
# - Never use HTML, CSS, or styling — only plain text or Markdown.
# - Use **H1 only once** for the main blog title.
# - Use **H2 for all other section headings**.
# - Keep body text in plain/default font size.

# 📌 Blog Request Details:
# - Topic: {topic};
# - Word count target: {word_count};
# - Tone: {tone};
# - Company Context: Write from the perspective of {companyName}. Mention the company naturally where it makes sense.
# - Keywords: {keywords}

# 📌 Structure:
# - H1: Main Blog Title
# - Introduction paragraph
# - Multiple H2 sections with detailed content
# - Conclusion paragraph

# {f"📌 Match the writing style and tone of this sample blog:\n{sample_blog}" if sample_blog else ""}
# {f"📌 Analyze the company content at {company_url} and write an improved, unique version that is:\n- More professional\n- More engaging\n- 100% original" if competitor_url else ""}

# ⚡ Final Requirements:
# - Make the blog sound 100% human-written, natural, and professional.
# - Ensure it passes Quillbot AI Content Detector with 0% AI likelihood.
# - Deliver the blog in plain text or Markdown only.
# """

# }

# # --- SEO and meta helpers ---
# def calculate_seo_score(title: str, content: str, keywords: List[str]) -> int:
#     score = 0.0
#     max_score = 10.0
#     title_len = len(title)
#     if 50 <= title_len <= 60:
#         score += 1.5
#     elif 40 <= title_len <= 70:
#         score += 1.0
#     word_count = len(content.split())
#     if word_count >= 300:
#         score += 1.5
#         if word_count >= 800:
#             score += 0.5
#     h1_count = content.count('# ')
#     h2_count = content.count('## ')
#     if h1_count == 1:
#         score += 1.0
#     if h2_count >= 3:
#         score += 1.0
#     content_lower = content.lower()
#     title_lower = title.lower()
#     for keyword in keywords:
#         keyword_lower = keyword.lower()
#         if keyword_lower in title_lower:
#             score += 0.5
#         keyword_count = content_lower.count(keyword_lower)
#         keyword_density = (keyword_count / word_count) * 100 if word_count > 0 else 0
#         if 1 <= keyword_density <= 3:
#             score += 0.5
#         elif 0.5 <= keyword_density <= 4:
#             score += 0.3
#     score += 1.0
#     return min(score, max_score)

# def generate_meta_description(content: str, max_length: int = 160) -> str:
#     paragraphs = content.split('\n\n')
#     first_paragraph = paragraphs[0] if paragraphs else content[:200]
#     clean_text = re.sub(r'[#*`]', '', first_paragraph)
#     if len(clean_text) > max_length:
#         clean_text = clean_text[:max_length-3] + "..."
#     return clean_text

# # --- Main blog generation endpoint ---
# @app.post("/generate-blog", response_model=BlogResponse)
# async def generate_blog(request: BlogRequest):
#     try:
#         company_context = ""
#         if request.company_name:
#             company_context = f"Company context: Write from the perspective of {request.company_name}. Naturally mention the company where relevant."
        
#         template_prompt = TEMPLATE_PROMPTS.get(request.template, TEMPLATE_PROMPTS["general"])
#         prompt = template_prompt.format(
#             topic=request.topic,
#             language=request.language,
#             word_count=request.word_count,
#             tone=request.tone,
#             company_context=company_context,
#             keywords=", ".join(request.keywords) if request.keywords else "relevant industry terms"
#         )

#         if request.sample_blog:
#             prompt += f"\n\nUse the following sample blog to match style, tone, and structure:\n{request.sample_blog}"

#         # --- Add company URL guidance if provided ---
#         if request.company_url:
#             prompt += f"\n\nAnalyze the company's content at {request.company_url} and write a better, original version in a human-like professional style."

#         # Call OpenAI API
#         response = openai.chat.completions.create(
#             model="gpt-4o-mini",
#             messages=[
#                 {
#                     "role": "system",
#                     "content": "You are an expert content writer and SEO specialist. Create high-quality, engaging blog content that is well-structured and SEO-optimized."
#                 },
#                 {"role": "user", "content": prompt}
#             ],
#             max_tokens=2000,
#             temperature=0.7
#         )

#         generated_content = response.choices[0].message.content.strip()
#         lines = generated_content.split('\n')
#         title = lines[0].replace('# ', '').strip()
#         content = '\n'.join(lines[1:]).strip()
#         word_count = len(content.split())
#         seo_score = calculate_seo_score(title, content, request.keywords or [])
#         meta_description = generate_meta_description(content)

#          # --- Save to Supabase ---
#         blog_data = {
#             "title": title,
#             "topic": request.topic,
#             "content": content,
#             "word_count": word_count,
#             "seo_score": round(seo_score),
#             # "seo_score": int(round(seo_score, 0)),

#             "meta_description": meta_description,
#             "keywords_used": request.keywords or [],
#             "template": request.template,
#             "tone": request.tone,
#             "language": request.language,
#             "company_name": request.company_name,
#             "status": "published",
#             "user_id": request.user_id,
#             "created_at": datetime.utcnow().isoformat()
#         }

#         insert_res = supabase.table("blogs").insert(blog_data, returning="representation").execute()
#         if insert_res.error:
#             raise HTTPException(status_code=500, detail=f"Supabase insert error: {insert_res.error}")

#         if not insert_res.data or len(insert_res.data) == 0:
#            raise HTTPException(status_code=500, detail="Supabase insert failed: empty response")
        
#         # result = supabase.table("blogs").insert(blog_data).select("*").execute()

#         inserted_row= insert_res.data[0]

#         return BlogResponse(
#             id=inserted_row.get("id"),
#             title=title,
#             content=content,
#             word_count=word_count,
#             seo_score=round(seo_score),
#             meta_description=meta_description,
#             keywords_used=request.keywords or [],
#             status=inserted_row.get("status"),
#             user_id=inserted_row.get("user_id"),
#             created_at=inserted_row.get("created_at")
            
#         )

#     except Exception as e:
#         raise HTTPException(status_code=500, detail=f"Error generating blog: {str(e)}")
    
# @app.get("/blogs/{blog_id}", response_model=BlogResponse)
# async def get_blog(blog_id: str, user_id: Optional[str] = Query(None, description="optional user_id to scope the query")):
#     try:
#         query = supabase.table("blogs").select("*")
#         # if user_id provided, scope by it
#         if user_id:
#             query = query.eq("user_id", user_id)
#         res = query.eq("id", blog_id).maybe_single().execute()

#         if res.error:
#             raise HTTPException(status_code=500, detail=f"Supabase error: {res.error}")

#         if not res.data:
#             raise HTTPException(status_code=404, detail="Blog not found")

#         row = res.data
#         return BlogResponse(
#             id=row.get("id"),
#             title=row.get("title") or "",
#             content=row.get("content") or "",
#             word_count=row.get("word_count") or 0,
#             seo_score=row.get("seo_score") or 0,
#             meta_description=row.get("meta_description") or "",
#             keywords_used=row.get("keywords_used") or [],
#             status=row.get("status"),
#             user_id=row.get("user_id"),
#             created_at=row.get("created_at")

#         )
#     except HTTPException:
#         raise
#     except Exception as e:
#         raise HTTPException(status_code=500, detail=f"Error fetching blog: {str(e)}")


# # --- Scraper endpoint ---
# @app.post("/scrape-content", response_model=ScrapeResponse)
# async def scrape_content(request: ScrapeRequest):
#     try:
#         headers = {
#             'User-Agent': 'Mozilla/5.0'
#         }
#         response = requests.get(request.url, headers=headers, timeout=10)
#         response.raise_for_status()
#         soup = BeautifulSoup(response.content, 'html.parser')

#         title = soup.find('title').get_text() if soup.find('title') else ""
#         content = ""
#         if request.extract_type in ["content", "all"]:
#             for script in soup(["script", "style"]):
#                 script.decompose()
#             lines = (line.strip() for line in soup.get_text().splitlines())
#             content = '\n'.join(line for line in lines if line)

#         links = []
#         if request.extract_type in ["links", "all"]:
#             for link in soup.find_all('a', href=True):
#                 links.append(link['href'])

#         images = []
#         if request.extract_type in ["images", "all"]:
#             for img in soup.find_all('img', src=True):
#                 images.append(img['src'])

#         return ScrapeResponse(
#             url=request.url,
#             title=title,
#             content=content[:2000],
#             links=links[:20],
#             images=images[:10]
#         )

#     except Exception as e:
#         raise HTTPException(status_code=500, detail=f"Error scraping content: {str(e)}")

# # --- Health check endpoint ---
# @app.get("/health")
# async def health_check():
#     return {"status": "healthy", "message": "AI Blog Generator API is running"}

# # --- Run server ---
# if __name__ == "__main__":
#     import uvicorn
#     uvicorn.run(app, host="0.0.0.0", port=8000)


from fastapi import FastAPI, HTTPException, Query
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel
from typing import List, Optional
import openai
import os
from bs4 import BeautifulSoup
import requests
import re
from dotenv import load_dotenv
from pathlib import Path
from supabase import create_client, Client
from datetime import datetime

# Load .env
env_path = Path(__file__).parent / ".env"
load_dotenv(dotenv_path=env_path)

# Initialize FastAPI app
app = FastAPI(title="AI Blog Generator API", version="1.0.0")

# Add CORS middleware
app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:3000", "https://your-frontend-domain.com"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Set OpenAI API key
openai.api_key = os.getenv("OPENAI_API_KEY")
if not openai.api_key:
    raise ValueError("OpenAI API key not set. Please add it in .env file.")

SUPABASE_URL = os.getenv("SUPABASE_URL")
SUPABASE_SERVICE_KEY = os.getenv("SUPABASE_SERVICE_KEY")
supabase: Client = create_client(SUPABASE_URL, SUPABASE_SERVICE_KEY)

# --- Pydantic models ---
class BlogRequest(BaseModel):
    topic: str
    company_name: Optional[str] = None
    template: str = "general"
    language: str = "English"
    keywords: Optional[List[str]] = []
    tone: str = "professional"
    word_count: int = 800
    user_id: Optional[str] = None
    sample_blog: Optional[str] = None     # 🆕
    company_url: Optional[str] = None     # 🆕 only this

class BlogResponse(BaseModel):
    id: Optional[str] = None
    title: str
    content: str
    word_count: int
    seo_score: int
    meta_description: str
    keywords_used: List[str]
    status: Optional[str] = None
    user_id: Optional[str] = None
    created_at: Optional[str] = None

class ScrapeRequest(BaseModel):
    url: str
    extract_type: str = "content"  # content, links, images

class ScrapeResponse(BaseModel):
    url: str
    title: str
    content: str
    links: List[str]
    images: List[str]

# --- Template prompts ---
TEMPLATE_PROMPTS = {
    "general": """
Write a comprehensive blog post about {topic} in {language}.
Target word count: {word_count} words.
Tone: {tone}
{company_context}

Structure the blog with:
- Engaging H1 title
- Introduction paragraph
- Multiple H2 section headings
- Detailed content under each section
- Conclusion
- Include relevant keywords naturally: {keywords}

Make it SEO-optimized with proper heading hierarchy and keyword usage.
""",
    "product-review": """
Write a detailed product review about {topic} in {language}.
Target word count: {word_count} words.
Tone: {tone}
{company_context}

Structure the review with:
- H1: Product Review Title
- H2: Overview/Introduction
- H2: Key Features
- H2: Pros and Cons
- H2: User Experience
- H2: Pricing and Value
- H2: Final Verdict/Rating
- Conclusion

Include keywords: {keywords}
Make it helpful for buyers making decisions.
""",
    "listicle": """
Create an engaging listicle about {topic} in {language}.
Target word count: {word_count} words.
Tone: {tone}
{company_context}

Structure as:
- H1: Catchy numbered title
- Introduction
- H2: Item 1
- H2: Item 2
- (Continue with more items)
- H2: Conclusion

Include keywords: {keywords}
Make each list item actionable and valuable.
""",
    "press-release": """
Write a professional press release about {topic} in {language}.
Target word count: {word_count} words.
Tone: professional
{company_context}

Structure with:
- H1: Headline
- Dateline and location
- H2: Opening paragraph
- H2: Body paragraphs with details
- H2: Company background
- H2: Contact information

Include keywords: {keywords}
Follow AP style guidelines for press releases.
""",
    "how-to": """
Create a comprehensive how-to guide about {topic} in {language}.
Target word count: {word_count} words.
Tone: {tone}
{company_context}

Structure with:
- H1: How to [Topic]
- H2: Introduction/Why this matters
- H2: What You'll Need
- H2: Step 1: [First Step]
- H2: Step 2: [Second Step]
- (Continue with more steps)
- H2: Tips and Troubleshooting
- H2: Conclusion

Include keywords: {keywords}
Make it beginner-friendly with clear instructions.
"""
}

# --- System instructions ---
SYSTEM_MESSAGE = """
You are an expert human content writer and SEO strategist.
Write high-quality, professional blog content that reads 100% like a human wrote it.
Rules:
- Use simple, professional, clear English.
- Vary sentence length naturally (short + medium + long).
- Use natural transitions like "For example," "In addition," "On the other hand".
- Include relatable examples or analogies where helpful.
- Avoid robotic, repetitive, or AI-like phrasing.
- Optimize for SEO naturally; do not keyword-stuff.
- Output only plain text or Markdown (no HTML).
- Use H1 only for the main blog title.
- Use H2 for all other section headings.
"""

# --- Helper: scrape content from URL ---
def scrape_content_from_url(url: str) -> str:
    try:
        res = requests.get(url, timeout=10, headers={"User-Agent": "Mozilla/5.0"})
        if res.status_code == 200:
            soup = BeautifulSoup(res.text, "html.parser")
            for s in soup(["script", "style"]):
                s.decompose()
            text = " ".join(p.get_text() for p in soup.find_all("p"))
            return text[:2000]  # limit size
        return ""
    except Exception as e:
        print(f"Scraping error for {url}: {e}")
        return ""

# --- SEO helpers ---
def calculate_seo_score(title: str, content: str, keywords: List[str]) -> int:
    score = 0.0
    max_score = 10.0
    title_len = len(title)
    if 50 <= title_len <= 60:
        score += 1.5
    elif 40 <= title_len <= 70:
        score += 1.0
    word_count = len(content.split())
    if word_count >= 300:
        score += 1.5
        if word_count >= 800:
            score += 0.5
    if content.count("# ") == 1:
        score += 1.0
    if content.count("## ") >= 3:
        score += 1.0
    content_lower = content.lower()
    title_lower = title.lower()
    for kw in keywords:
        kw_lower = kw.lower()
        if kw_lower in title_lower:
            score += 0.5
        kw_count = content_lower.count(kw_lower)
        kw_density = (kw_count / word_count) * 100 if word_count else 0
        if 1 <= kw_density <= 3:
            score += 0.5
        elif 0.5 <= kw_density <= 4:
            score += 0.3
    score += 1.0
    return min(score, max_score)

def generate_meta_description(content: str, max_length: int = 160) -> str:
    paragraphs = content.split("\n\n")
    first_para = paragraphs[0] if paragraphs else content[:200]
    clean = re.sub(r"[#*`]", "", first_para)
    return clean[:max_length-3] + "..." if len(clean) > max_length else clean

# --- Main blog generation ---
@app.post("/generate-blog", response_model=BlogResponse)
async def generate_blog(request: BlogRequest):
    try:
        # Build company context
        company_context = ""
        if request.company_name:
            company_context = f"Company context: Write from the perspective of {request.company_name}."

        # Pick template and fill
        template_prompt = TEMPLATE_PROMPTS.get(request.template, TEMPLATE_PROMPTS["general"])
        user_prompt = template_prompt.format(
            topic=request.topic,
            language=request.language,
            word_count=request.word_count,
            tone=request.tone,
            company_context=company_context,
            keywords=", ".join(request.keywords) if request.keywords else "relevant industry terms"
        )

        # Add sample blog if given
        if request.sample_blog:
            user_prompt += f"\n\nMatch the writing style and tone of this sample blog:\n'''{request.sample_blog[:1500]}'''\n"

        # Add company_url scraped content if given
        if request.company_url:
            scraped = scrape_content_from_url(request.company_url)
            if scraped:
                user_prompt += f"\n\nTake inspiration from competitor/company blog content:\n'''{scraped}'''\n"

        # Final requirements
        user_prompt += """
Final requirements:
- Use H1 only for the main blog title.
- Use H2 for all section headings.
- Plain text or Markdown only.
- Keep tone professional, human-like, natural.
"""

        # Call OpenAI
        response = openai.chat.completions.create(
            model="gpt-4o-mini",
            messages=[
                {"role": "system", "content": SYSTEM_MESSAGE},
                {"role": "user", "content": user_prompt}
            ],
            max_tokens=2000,
            temperature=0.7
        )

        generated_text = response.choices[0].message.content.strip()

        # Extract title
        match = re.search(r"^#\s+(.*)", generated_text, re.MULTILINE)
        if match:
            title = match.group(1).strip()
            content = re.sub(r"^#\s+.*\n", "", generated_text, count=1, flags=re.MULTILINE).strip()
        else:
            lines = [l for l in generated_text.splitlines() if l.strip()]
            title = re.sub(r"^[#\s]+", "", lines[0]).strip() if lines else request.topic
            content = generated_text

        word_count = len(content.split())
        seo_score = calculate_seo_score(title, content, request.keywords or [])
        meta_description = generate_meta_description(content)

        # Save to Supabase
        blog_data = {
            "title": title,
            "topic": request.topic,
            "content": content,
            "word_count": word_count,
            "seo_score": round(seo_score),
            "meta_description": meta_description,
            "keywords_used": request.keywords or [],
            "template": request.template,
            "tone": request.tone,
            "language": request.language,
            "company_name": request.company_name,
            "status": "published",
            "user_id": request.user_id,
            "created_at": datetime.utcnow().isoformat()
        }
        res = supabase.table("blogs").insert(blog_data, returning="representation").execute()
        if not getattr(res, "data", None):
            raise HTTPException(status_code=500, detail="Failed to insert blog into Supabase")

        row = res.data[0]
        return BlogResponse(
            id=row.get("id"),
            title=title,
            content=content,
            word_count=word_count,
            seo_score=round(seo_score),
            meta_description=meta_description,
            keywords_used=request.keywords or [],
            status=row.get("status"),
            user_id=row.get("user_id"),
            created_at=row.get("created_at")
        )
    except HTTPException:
        raise
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Error generating blog: {str(e)}")

# --- Fetch blog ---
@app.get("/blogs/{blog_id}", response_model=BlogResponse)
async def get_blog(blog_id: str, user_id: Optional[str] = Query(None)):
    try:
        query = supabase.table("blogs").select("*")
        if user_id:
            query = query.eq("user_id", user_id)
        res = query.eq("id", blog_id).maybe_single().execute()
        if not getattr(res, "data", None):
            raise HTTPException(status_code=404, detail="Blog not found")
        row = res.data
        return BlogResponse(
            id=row.get("id"),
            title=row.get("title") or "",
            content=row.get("content") or "",
            word_count=row.get("word_count") or 0,
            seo_score=row.get("seo_score") or 0,
            meta_description=row.get("meta_description") or "",
            keywords_used=row.get("keywords_used") or [],
            status=row.get("status"),
            user_id=row.get("user_id"),
            created_at=row.get("created_at")
        )
    except HTTPException:
        raise
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Error fetching blog: {str(e)}")

# --- Scraper endpoint ---
@app.post("/scrape-content", response_model=ScrapeResponse)
async def scrape_content(request: ScrapeRequest):
    try:
        res = requests.get(request.url, headers={"User-Agent": "Mozilla/5.0"}, timeout=10)
        res.raise_for_status()
        soup = BeautifulSoup(res.content, "html.parser")
        for s in soup(["script", "style"]):
            s.decompose()
        title = soup.find("title").get_text() if soup.find("title") else ""
        content = "\n".join(line.strip() for line in soup.get_text().splitlines() if line.strip())
        links = [a["href"] for a in soup.find_all("a", href=True)][:20]
        images = [img["src"] for img in soup.find_all("img", src=True)][:10]
        return ScrapeResponse(url=request.url, title=title, content=content[:2000], links=links, images=images)
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Error scraping content: {str(e)}")

@app.get("/health")
async def health_check():
    return {"status": "healthy", "message": "AI Blog Generator API is running"}

if __name__ == "__main__":
    import uvicorn
    uvicorn.run(app, host="0.0.0.0", port=8000)


