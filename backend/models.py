from sqlalchemy import Column, Integer, String, DateTime
from sqlalchemy.dialects.mysql import LONGTEXT
from sqlalchemy.sql import func
from database import Base
from pydantic import BaseModel
from typing import List, Dict, Optional
from datetime import datetime


class Quiz(Base):
    __tablename__ = "quizzes"

    id = Column(Integer, primary_key=True, index=True)
    url = Column(String(512), nullable=False, unique=True)
    title = Column(String(1024))
    date_generated = Column(DateTime(timezone=True), server_default=func.now())
    scraped_content = Column(LONGTEXT)
    full_quiz_data = Column(LONGTEXT)


class QuestionSchema(BaseModel):
    question: str
    options: List[str]
    answer: str
    explanation: str
    difficulty: str

    class Config:
        orm_mode = True
        extra = "allow"


class QuizOutputSchema(BaseModel):
    title: Optional[str]
    key_entities: Dict[str, List[str]]
    topics: List[str]
    questions: List[QuestionSchema]
    sections: Optional[List[str]] = []

    class Config:
        orm_mode = True
        extra = "allow"


class QuizListItem(BaseModel):
    id: int
    url: str
    title: Optional[str]
    date_generated: datetime

    class Config:
        orm_mode = True
        extra = "allow"


class QuizDetailResponse(BaseModel):
    id: int
    url: str
    title: Optional[str]
    date_generated: datetime
    scraped_content: Optional[str]
    quiz: QuizOutputSchema

    class Config:
        orm_mode = True
        extra = "allow"
