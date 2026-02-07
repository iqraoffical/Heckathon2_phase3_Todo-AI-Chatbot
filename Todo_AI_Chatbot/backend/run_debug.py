from app.main import app
import uvicorn
import sys
import traceback

if __name__ == "__main__":
    try:
        print("Starting server...")
        uvicorn.run(app, host="localhost", port=8000, log_level="info")
    except Exception as e:
        print(f"Error starting server: {e}")
        traceback.print_exc()
        sys.exit(1)