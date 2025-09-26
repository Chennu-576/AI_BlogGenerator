# AI Blog Generator Backend

This is the Python FastAPI backend for the AI Blog Generator application.

## Setup Instructions

1. **Install Python 3.8 or higher**

2. **Create a virtual environment:**
   ```bash
   python -m venv venv
   source venv/bin/activate  # On Windows: venv\Scripts\activate
   ```

3. **Install dependencies:**
   ```bash
   pip install -r requirements.txt
   ```

4. **Set up environment variables:**
   Create a `.env` file in the backend directory:
   ```
   OPENAI_API_KEY=your_openai_api_key_here
   ```

5. **Run the server:**
   ```bash
   python main.py
   ```
   
   Or using uvicorn directly:
   ```bash
   uvicorn main:app --reload --host 0.0.0.0 --port 8000
   ```

## API Endpoints

### POST /generate-blog
Generate a blog post using AI.

**Request Body:**
```json
{
  "topic": "How to improve SEO",
  "company_name": "TechCorp",
  "template": "how-to",
  "language": "English",
  "keywords": ["SEO", "search optimization", "rankings"],
  "tone": "professional",
  "word_count": 1200
}
```

**Response:**
```json
{
  "title": "How to Improve SEO: A Complete Guide",
  "content": "# How to Improve SEO: A Complete Guide\n\n...",
  "word_count": 1200,
  "seo_score": 8.5,
  "meta_description": "Learn how to improve your website's SEO...",
  "keywords_used": ["SEO", "search optimization", "rankings"]
}
```

### POST /scrape-content
Scrape content from a URL.

**Request Body:**
```json
{
  "url": "https://example.com/article",
  "extract_type": "content"
}
```

### GET /health
Health check endpoint.

## Features

- **Multiple Templates:** General, product review, listicle, press release, how-to guide
- **Multi-language Support:** 20+ languages including Telugu, Hindi, etc.
- **SEO Optimization:** Automatic SEO scoring and optimization
- **Web Scraping:** Extract content from external URLs
- **Customizable:** Adjustable tone, word count, and company branding

## Template Types

1. **General Article:** Standard blog post format
2. **Product Review:** Detailed product analysis with pros/cons
3. **Listicle:** List-based content that's highly shareable
4. **Press Release:** Professional announcements for media
5. **How-to Guide:** Step-by-step instructional content

## SEO Scoring

The API calculates SEO scores based on:
- Title length (50-60 characters optimal)
- Content length (300+ words)
- Heading structure (proper H1/H2 hierarchy)
- Keyword usage and density
- Content structure and readability

## Error Handling

The API includes comprehensive error handling for:
- Invalid requests
- OpenAI API errors
- Web scraping failures
- Network timeouts

## CORS Configuration

CORS is configured to allow requests from:
- `http://localhost:3000` (development)
- Your production frontend domain

Update the CORS origins in `main.py` for your specific domains.