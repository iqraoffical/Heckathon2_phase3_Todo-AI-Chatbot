from fastapi import FastAPI
from app.api.routers import tasks
from app.api.routers import auth

app = FastAPI(title="Todo API Debug", version="1.0.0")

# Include routers
app.include_router(auth.router, prefix="/api/auth", tags=["auth"])
app.include_router(tasks.router, prefix="/api", tags=["tasks"])

@app.get("/")
def read_root():
    return {"message": "Debug Todo API"}

# Add CORS middleware to allow requests from the frontend
from fastapi.middleware.cors import CORSMiddleware

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],  # In production, replace with your frontend domain
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

if __name__ == "__main__":
    import uvicorn
    import sys
    import traceback

    try:
        print("Starting debug server...")
        uvicorn.run(app, host="localhost", port=8000, log_level="info")
    except Exception as e:
        print(f"Error starting server: {e}")
        traceback.print_exc()
        sys.exit(1)