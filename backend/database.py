import os
from sqlalchemy import create_engine
from sqlalchemy.orm import sessionmaker, declarative_base

# You can replace this with MySQL or PostgreSQL in .env
DATABASE_URL = os.getenv("DATABASE_URL", "sqlite:///./quiz_history.db")

# Engine setup (MYSQL / POSTGRES / SQLITE)
engine = create_engine(
    DATABASE_URL,
    echo=False,
    future=True,
    pool_pre_ping=True  # Prevent dead connections in MySQL/Postgres
)

SessionLocal = sessionmaker(
    bind=engine,
    autocommit=False,
    autoflush=False
)

Base = declarative_base()


def init_db():
    """
    Import models and create all tables.
    Safe import to avoid circular dependency issues.
    """
    from models import Quiz
    Base.metadata.create_all(bind=engine)
