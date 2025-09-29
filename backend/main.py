# from fastapi import FastAPI, HTTPException
# from fastapi.middleware.cors import CORSMiddleware
# from pydantic import BaseModel
# from typing import List, Optional
# import openai
# import os
# from bs4 import BeautifulSoup
# import requests
# import re
# import json
# from dotenv import load_dotenv

# # load_dotenv()
# from pathlib import Path

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
# # openai.api_key = os.getenv("OPENAI_API_KEY")
# openai.api_key = os.getenv("OPENAI_API_KEY")
# if not openai.api_key:
#     raise ValueError("OpenAI API key not set. Please add it in .env file.")

# # Pydantic models
# class BlogRequest(BaseModel):
#     topic: str
#     company_name: Optional[str] = None
#     template: str = "general"
#     language: str = "English"
#     keywords: Optional[List[str]] = []
#     tone: str = "professional"
#     word_count: int = 800

# class BlogResponse(BaseModel):
#     title: str
#     content: str
#     word_count: int
#     seo_score: float
#     meta_description: str
#     keywords_used: List[str]

# class ScrapeRequest(BaseModel):
#     url: str
#     extract_type: str = "content"  # content, links, images

# class ScrapeResponse(BaseModel):
#     url: str
#     title: str
#     content: str
#     links: List[str]
#     images: List[str]

# # Template prompts
# TEMPLATE_PROMPTS = {
#     "general": """
#     Write a comprehensive blog post about {topic} in {language}.
#     Target word count: {word_count} words.
#     Tone: {tone}
#     {company_context}
    
#     Structure the blog with:
#     - Engaging H1 title
#     - Introduction paragraph
#     - Multiple H2 section headings
#     - Detailed content under each section
#     - Conclusion
#     - Include relevant keywords naturally: {keywords}
    
#     Make it SEO-optimized with proper heading hierarchy and keyword usage.
#     """,
    
#     "product-review": """
#     Write a detailed product review about {topic} in {language}.
#     Target word count: {word_count} words.
#     Tone: {tone}
#     {company_context}
    
#     Structure the review with:
#     - H1: Product Review Title
#     - H2: Overview/Introduction
#     - H2: Key Features
#     - H2: Pros and Cons
#     - H2: User Experience
#     - H2: Pricing and Value
#     - H2: Final Verdict/Rating
#     - Conclusion
    
#     Include keywords: {keywords}
#     Make it helpful for buyers making decisions.
#     """,
    
#     "listicle": """
#     Create an engaging listicle about {topic} in {language}.
#     Target word count: {word_count} words.
#     Tone: {tone}
#     {company_context}
    
#     Structure as:
#     - H1: Catchy numbered title (e.g., "X Best Ways to...")
#     - Introduction
#     - H2: Item 1
#     - H2: Item 2
#     - (Continue with more items)
#     - H2: Conclusion
    
#     Include keywords: {keywords}
#     Make each list item actionable and valuable.
#     """,
    
#     "press-release": """
#     Write a professional press release about {topic} in {language}.
#     Target word count: {word_count} words.
#     Tone: professional
#     {company_context}
    
#     Structure with:
#     - H1: Headline
#     - Dateline and location
#     - H2: Opening paragraph (who, what, when, where, why)
#     - H2: Body paragraphs with details
#     - H2: Company background
#     - H2: Contact information
    
#     Include keywords: {keywords}
#     Follow AP style guidelines for press releases.
#     """,
    
#     "how-to": """
#     Create a comprehensive how-to guide about {topic} in {language}.
#     Target word count: {word_count} words.
#     Tone: {tone}
#     {company_context}
    
#     Structure with:
#     - H1: How to [Topic]
#     - H2: Introduction/Why this matters
#     - H2: What You'll Need
#     - H2: Step 1: [First Step]
#     - H2: Step 2: [Second Step]
#     - (Continue with more steps)
#     - H2: Tips and Troubleshooting
#     - H2: Conclusion
    
#     Include keywords: {keywords}
#     Make it beginner-friendly with clear instructions.
#     """
# }

# def calculate_seo_score(title: str, content: str, keywords: List[str]) -> float:
#     """
#     Calculate SEO score based on various factors
#     """
#     score = 0.0
#     max_score = 10.0
    
#     # Title length check (50-60 characters is ideal)
#     title_len = len(title)
#     if 50 <= title_len <= 60:
#         score += 1.5
#     elif 40 <= title_len <= 70:
#         score += 1.0
    
#     # Content length check
#     word_count = len(content.split())
#     if word_count >= 300:
#         score += 1.5
#         if word_count >= 800:
#             score += 0.5
    
#     # Heading structure check
#     h1_count = content.count('# ')
#     h2_count = content.count('## ')
    
#     if h1_count == 1:  # Should have exactly one H1
#         score += 1.0
#     if h2_count >= 3:  # Should have multiple H2s
#         score += 1.0
    
#     # Keyword usage check
#     content_lower = content.lower()
#     title_lower = title.lower()
    
#     for keyword in keywords:
#         keyword_lower = keyword.lower()
        
#         # Keyword in title
#         if keyword_lower in title_lower:
#             score += 0.5
        
#         # Keyword density (should be 1-3%)
#         keyword_count = content_lower.count(keyword_lower)
#         keyword_density = (keyword_count / word_count) * 100 if word_count > 0 else 0
        
#         if 1 <= keyword_density <= 3:
#             score += 0.5
#         elif 0.5 <= keyword_density <= 4:
#             score += 0.3
    
#     # Meta description length (if generated)
#     # This would be checked if meta description is provided
#     score += 1.0  # Base score for having structured content
    
#     return min(score, max_score)

# def generate_meta_description(content: str, max_length: int = 160) -> str:
#     """
#     Generate meta description from content
#     """
#     # Extract first paragraph or first few sentences
#     paragraphs = content.split('\n\n')
#     first_paragraph = paragraphs[0] if paragraphs else content[:200]
    
#     # Remove markdown formatting
#     clean_text = re.sub(r'[#*`]', '', first_paragraph)
    
#     # Truncate to max length
#     if len(clean_text) > max_length:
#         clean_text = clean_text[:max_length-3] + "..."
    
#     return clean_text

# @app.post("/generate-blog", response_model=BlogResponse)
# async def generate_blog(request: BlogRequest):
#     """
#     Generate a blog post using OpenAI GPT
#     """
#     try:
#         # Prepare company context
#         company_context = ""
#         if request.company_name:
#             company_context = f"Company context: Write from the perspective of {request.company_name}. Naturally mention the company where relevant."
        
#         # Get template prompt
#         template_prompt = TEMPLATE_PROMPTS.get(request.template, TEMPLATE_PROMPTS["general"])
        
#         # Format prompt
#         prompt = template_prompt.format(
#             topic=request.topic,
#             language=request.language,
#             word_count=request.word_count,
#             tone=request.tone,
#             company_context=company_context,
#             keywords=", ".join(request.keywords) if request.keywords else "relevant industry terms"
#         )
        
#         # Generate content using OpenAI
       
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
        
#         # Extract title (assuming first line is title)
#         lines = generated_content.split('\n')
#         title = lines[0].replace('# ', '').strip()
#         content = '\n'.join(lines[1:]).strip()
        
#         # Calculate word count
#         word_count = len(content.split())
        
#         # Calculate SEO score
#         seo_score = calculate_seo_score(title, content, request.keywords or [])
        
#         # Generate meta description
#         meta_description = generate_meta_description(content)
        
#         return BlogResponse(
#             title=title,
#             content=content,
#             word_count=word_count,
#             seo_score=round(seo_score, 1),
#             meta_description=meta_description,
#             keywords_used=request.keywords or []
#         )
        
#     except Exception as e:
#         raise HTTPException(status_code=500, detail=f"Error generating blog: {str(e)}")

# @app.post("/scrape-content", response_model=ScrapeResponse)
# async def scrape_content(request: ScrapeRequest):
#     """
#     Scrape content from a given URL
#     """
#     try:
#         # Make request to URL
#         headers = {
#             'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/91.0.4472.124 Safari/537.36'
#         }
#         response = requests.get(request.url, headers=headers, timeout=10)
#         response.raise_for_status()
        
#         # Parse HTML
#         soup = BeautifulSoup(response.content, 'html.parser')
        
#         # Extract title
#         title = soup.find('title').get_text() if soup.find('title') else ""
        
#         # Extract content
#         content = ""
#         if request.extract_type == "content":
#             # Remove script and style elements
#             for script in soup(["script", "style"]):
#                 script.decompose()
            
#             # Get text content
#             content = soup.get_text()
#             # Clean up whitespace
#             lines = (line.strip() for line in content.splitlines())
#             content = '\n'.join(line for line in lines if line)
        
#         # Extract links
#         links = []
#         if request.extract_type in ["links", "all"]:
#             for link in soup.find_all('a', href=True):
#                 links.append(link['href'])
        
#         # Extract images
#         images = []
#         if request.extract_type in ["images", "all"]:
#             for img in soup.find_all('img', src=True):
#                 images.append(img['src'])
        
#         return ScrapeResponse(
#             url=request.url,
#             title=title,
#             content=content[:2000],  # Limit content length
#             links=links[:20],  # Limit number of links
#             images=images[:10]  # Limit number of images
#         )
        
#     except Exception as e:
#         raise HTTPException(status_code=500, detail=f"Error scraping content: {str(e)}")

# @app.get("/health")
# async def health_check():
#     """
#     Health check endpoint
#     """
#     return {"status": "healthy", "message": "AI Blog Generator API is running"}

# if __name__ == "__main__":
#     import uvicorn
#     uvicorn.run(app, host="0.0.0.0", port=8000



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
# from supabase import create_client
from datetime import datetime

# Load .env
env_path = Path(__file__).parent / ".env"
load_dotenv(dotenv_path=env_path)

# Initialize FastAPI app
app = FastAPI(title="AI Blog Generator API", version="1.0.0")

# Add CORS middleware
app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:3000", "aicontentgenerate.netlify.app"],
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

# --- SEO and meta helpers ---
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
    h1_count = content.count('# ')
    h2_count = content.count('## ')
    if h1_count == 1:
        score += 1.0
    if h2_count >= 3:
        score += 1.0
    content_lower = content.lower()
    title_lower = title.lower()
    for keyword in keywords:
        keyword_lower = keyword.lower()
        if keyword_lower in title_lower:
            score += 0.5
        keyword_count = content_lower.count(keyword_lower)
        keyword_density = (keyword_count / word_count) * 100 if word_count > 0 else 0
        if 1 <= keyword_density <= 3:
            score += 0.5
        elif 0.5 <= keyword_density <= 4:
            score += 0.3
    score += 1.0
    return min(score, max_score)

def generate_meta_description(content: str, max_length: int = 160) -> str:
    paragraphs = content.split('\n\n')
    first_paragraph = paragraphs[0] if paragraphs else content[:200]
    clean_text = re.sub(r'[#*`]', '', first_paragraph)
    if len(clean_text) > max_length:
        clean_text = clean_text[:max_length-3] + "..."
    return clean_text

# --- Main blog generation endpoint ---
@app.post("/generate-blog", response_model=BlogResponse)
async def generate_blog(request: BlogRequest):
    try:
        company_context = ""
        if request.company_name:
            company_context = f"Company context: Write from the perspective of {request.company_name}. Naturally mention the company where relevant."
        
        template_prompt = TEMPLATE_PROMPTS.get(request.template, TEMPLATE_PROMPTS["general"])
        prompt = template_prompt.format(
            topic=request.topic,
            language=request.language,
            word_count=request.word_count,
            tone=request.tone,
            company_context=company_context,
            keywords=", ".join(request.keywords) if request.keywords else "relevant industry terms"
        )

        # Call OpenAI API
        response = openai.chat.completions.create(
            model="gpt-4o-mini",
            messages=[
                {
                    "role": "system",
                    "content": "You are an expert content writer and SEO specialist. Create high-quality, engaging blog content that is well-structured and SEO-optimized."
                },
                {"role": "user", "content": prompt}
            ],
            max_tokens=2000,
            temperature=0.7
        )

        generated_content = response.choices[0].message.content.strip()
        lines = generated_content.split('\n')
        title = lines[0].replace('# ', '').strip()
        content = '\n'.join(lines[1:]).strip()
        word_count = len(content.split())
        seo_score = calculate_seo_score(title, content, request.keywords or [])
        meta_description = generate_meta_description(content)

         # --- Save to Supabase ---
        blog_data = {
            "title": title,
            "topic": request.topic,
            "content": content,
            "word_count": word_count,
            "seo_score": round(seo_score),
            # "seo_score": int(round(seo_score, 0)),

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

        insert_res = supabase.table("blogs").insert(blog_data, returning="representation").execute()
        if insert_res.error:
            raise HTTPException(status_code=500, detail=f"Supabase insert error: {insert_res.error}")

        if not insert_res.data or len(insert_res.data) == 0:
           raise HTTPException(status_code=500, detail="Supabase insert failed: empty response")
        
        # result = supabase.table("blogs").insert(blog_data).select("*").execute()

        inserted_row= insert_res.data[0]

        return BlogResponse(
            id=inserted_row.get("id"),
            title=title,
            content=content,
            word_count=word_count,
            seo_score=round(seo_score),
            meta_description=meta_description,
            keywords_used=request.keywords or [],
            status=inserted_row.get("status"),
            user_id=inserted_row.get("user_id"),
            created_at=inserted_row.get("created_at")
            
        )

    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Error generating blog: {str(e)}")
    
@app.get("/blogs/{blog_id}", response_model=BlogResponse)
async def get_blog(blog_id: str, user_id: Optional[str] = Query(None, description="optional user_id to scope the query")):
    try:
        query = supabase.table("blogs").select("*")
        # if user_id provided, scope by it
        if user_id:
            query = query.eq("user_id", user_id)
        res = query.eq("id", blog_id).maybe_single().execute()

        if res.error:
            raise HTTPException(status_code=500, detail=f"Supabase error: {res.error}")

        if not res.data:
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
        headers = {
            'User-Agent': 'Mozilla/5.0'
        }
        response = requests.get(request.url, headers=headers, timeout=10)
        response.raise_for_status()
        soup = BeautifulSoup(response.content, 'html.parser')

        title = soup.find('title').get_text() if soup.find('title') else ""
        content = ""
        if request.extract_type in ["content", "all"]:
            for script in soup(["script", "style"]):
                script.decompose()
            lines = (line.strip() for line in soup.get_text().splitlines())
            content = '\n'.join(line for line in lines if line)

        links = []
        if request.extract_type in ["links", "all"]:
            for link in soup.find_all('a', href=True):
                links.append(link['href'])

        images = []
        if request.extract_type in ["images", "all"]:
            for img in soup.find_all('img', src=True):
                images.append(img['src'])

        return ScrapeResponse(
            url=request.url,
            title=title,
            content=content[:2000],
            links=links[:20],
            images=images[:10]
        )

    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Error scraping content: {str(e)}")

# --- Health check endpoint ---
@app.get("/health")
async def health_check():
    return {"status": "healthy", "message": "AI Blog Generator API is running"}

# --- Run server ---
if __name__ == "__main__":
    import uvicorn
    uvicorn.run(app, host="0.0.0.0", port=8000)


