from sqlalchemy import create_engine
from sqlalchemy.ext.declarative import declarative_base
from sqlalchemy.orm import sessionmaker
from sqlmodel import Session
import os

DATABASE_URL = os.getenv("DATABASE_URL", "sqlite:///./todo_app.db")

engine = create_engine(DATABASE_URL, echo=True)
SessionLocal = sessionmaker(autocommit=False, autoflush=False, bind=engine)

def get_session():
    with SessionLocal() as session:
        yield session

def create_db_and_tables():
    from .models import User, Task, Project
    from sqlmodel import SQLModel
    SQLModel.metadata.create_all(engine)