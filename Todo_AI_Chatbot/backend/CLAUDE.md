# Backend Development Guide

## Project Structure
```
backend/
├── CLAUDE.md                 # This file
├── main.py                   # Application entry point
├── models.py                 # Database models using SQLModel
├── db.py                     # Database setup and session management
├── routes/                   # API route handlers
│   ├── __init__.py
│   ├── auth.py              # Authentication routes
│   ├── tasks.py             # Task management routes
│   └── chat.py              # Chatbot routes
├── auth.py                  # Authentication utilities
├── config.py                # Configuration settings
├── utils.py                 # Utility functions
├── mcp_tools.py             # MCP tools implementation
├── ai_agents.py             # OpenAI Agents integration
├── requirements.txt         # Python dependencies
└── .env                     # Environment variables (not committed)
```

## Dependencies
Install the required packages from requirements.txt:
```bash
pip install -r requirements.txt
```

## Environment Variables
Create a `.env` file in the backend directory with the following variables:
```
BETTER_AUTH_SECRET=S4paj8zsSf3ZIK0bKIwthxQjXzdbhjMI
DATABASE_URL=postgresql://neondb_owner:npg_FBcnSA3wM0Tk@ep-jolly-rain-a7lzfvk3-pooler.ap-southeast-2.aws.neon.tech/neondb?sslmode=require&channel_binding=require
API_URL=http://localhost:8000
OPENAI_API_KEY=your_openai_api_key_here
```

## Running the Backend
Start the development server:
```bash
uvicorn main:app --reload --port 8000
```

## API Documentation
After starting the server, visit http://localhost:8000/docs for interactive API documentation.