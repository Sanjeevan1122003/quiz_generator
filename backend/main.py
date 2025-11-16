import json
from fastapi import FastAPI, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel
import requests

from scraper import scrape_wikipedia
from llm_quiz_generator import generate_quiz_with_llm
from database import SessionLocal, init_db
from models import Quiz

# Initialize DB
init_db()

app = FastAPI()

# Enable CORS
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"]
)

class QuizRequest(BaseModel):
    url: str

def unwrap_quiz(data):
    if not isinstance(data, dict):
        return data

    if "questions" in data:
        return data

    if "quiz" in data and isinstance(data["quiz"], dict):
        return unwrap_quiz(data["quiz"])

    return data


@app.post("/generate_quiz")
def generate_quiz(req: QuizRequest):
    if not req.url or req.url.strip() == "":
        raise HTTPException(400, "URL cannot be empty")

    try:
        # VALIDATE URL
        if not req.url.startswith("http"):
            raise HTTPException(400, "Invalid URL format")

        if "wikipedia.org" not in req.url:
            raise HTTPException(400, "Only Wikipedia URLs are allowed")

        db = SessionLocal()

        # CHECK IF URL ALREADY EXISTS
        existing_quiz = db.query(Quiz).filter(Quiz.url == req.url).first()

        # SCRAPE WIKIPEDIA
        try:
            title, cleaned_text, sections, entities = scrape_wikipedia(req.url)
        except requests.exceptions.RequestException:
            raise HTTPException(502, "Failed to fetch data from Wikipedia (network error)")
        except Exception as e:
            raise HTTPException(500, f"Scraping failed: {str(e)}")

        if len(cleaned_text) < 100:
            raise HTTPException(422, "Wikipedia page contains insufficient content")

        # GENERATE QUIZ USING AI
        try:
            quizData = generate_quiz_with_llm(title, cleaned_text)
        except Exception as e:
            raise HTTPException(500, f"AI failed to process content: {str(e)}")

        final_quiz = unwrap_quiz(quizData)

        # UPDATE EXISTING RECORD
        if existing_quiz:
            try:
                existing_quiz.title = title
                existing_quiz.scraped_content = cleaned_text
                existing_quiz.full_quiz_data = json.dumps(final_quiz)
                db.commit()
                db.refresh(existing_quiz)
            except Exception as e:
                raise HTTPException(500, f"Database update failed: {str(e)}")

            return {
                "id": existing_quiz.id,
                "url": req.url,
                "title": title,
                "sections": sections,
                "key_entities": entities,
                "quiz": final_quiz
            }

        # INSERT NEW RECORD
        try:
            new_quiz = Quiz(
                url=req.url,
                title=title,
                scraped_content=cleaned_text,
                full_quiz_data=json.dumps(final_quiz)
            )
            db.add(new_quiz)
            db.commit()
            db.refresh(new_quiz)
        except Exception as e:
            raise HTTPException(500, f"Database insert failed: {str(e)}")

        return {
            "id": new_quiz.id,
            "url": req.url,
            "title": title,
            "sections": sections,
            "key_entities": entities,
            "quiz": final_quiz
        }

    except HTTPException as e:
        raise e

    except Exception as e:
        raise HTTPException(500, f"Unexpected server error: {str(e)}")


@app.get("/history")
def get_history():
    try:
        db = SessionLocal()
        items = db.query(Quiz).order_by(Quiz.id.asc()).all()
        db.close()

        return [
            {
                "id": q.id,
                "url": q.url,
                "title": q.title,
                "date_generated": q.date_generated
            }
            for q in items
        ]
    except Exception as e:
        raise HTTPException(500, f"Failed to fetch history: {str(e)}")


@app.get("/quiz/{quiz_id}")
def get_quiz(quiz_id: int):
    try:
        db = SessionLocal()
        quiz = db.query(Quiz).filter(Quiz.id == quiz_id).first()
        db.close()

        if not quiz:
            raise HTTPException(404, "Quiz not found")

        return {
            "id": quiz.id,
            "url": quiz.url,
            "title": quiz.title,
            "date_generated": quiz.date_generated,
            "scraped_content": quiz.scraped_content,
            "quiz": unwrap_quiz(json.loads(quiz.full_quiz_data))
        }

    except HTTPException as e:
        raise e

    except Exception as e:
        raise HTTPException(500, f"Error loading quiz: {str(e)}")

#  venv\Scripts\activate
# uvicorn main:app --reload --port 8000
