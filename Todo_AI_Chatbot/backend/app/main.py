from fastapi import FastAPI
from .api.routers import auth, tasks, projects
from .database import create_db_and_tables

app = FastAPI(title="Todo API", version="1.0.0")

# Create database tables on startup
@app.on_event("startup")
def on_startup():
    create_db_and_tables()

# Include routers
app.include_router(auth.router, prefix="/api/auth", tags=["auth"])
app.include_router(tasks.router, prefix="/api", tags=["tasks"])
app.include_router(projects.router, prefix="/api", tags=["projects"])

@app.get("/")
def read_root():
    return {"message": "Welcome to the Todo API"}

# Add CORS middleware to allow requests from the frontend
from fastapi.middleware.cors import CORSMiddleware

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],  # In production, replace with your frontend domain
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)