from contextlib import asynccontextmanager
from fastapi import FastAPI, Depends, HTTPException, status
from fastapi.middleware.cors import CORSMiddleware
from config import settings
from db import create_db_and_tables
from routes import tasks, chat
from routes.auth import router as auth_router
from auth import validate_user_from_jwt
import os
from dotenv import load_dotenv

load_dotenv()

@asynccontextmanager
async def lifespan(app: FastAPI):
    # Create tables on startup
    await create_db_and_tables()
    yield
    # Cleanup on shutdown if needed


app = FastAPI(
    title="Todo AI Chatbot Backend",
    description="Backend API for the Todo AI Chatbot application",
    version="1.0.0",
    lifespan=lifespan
)

# Add CORS middleware
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],  # In production, replace with specific origins
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Include routers
app.include_router(auth_router)  # Auth routes at /api/auth (prefix defined in router)
app.include_router(tasks.router, prefix="/api/{user_id}", tags=["tasks"])
app.include_router(chat.router, prefix="/api/{user_id}", tags=["chat"])

@app.get("/")
def read_root():
    return {"message": "Todo AI Chatbot Backend API"}

@app.get("/health")
def health_check():
    return {"status": "healthy"}