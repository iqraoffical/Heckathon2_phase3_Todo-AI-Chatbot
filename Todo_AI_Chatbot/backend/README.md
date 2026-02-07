# Todo App Backend - JWT Authentication Implementation

This project implements a FastAPI backend with JWT authentication for a secure full-stack Todo application.

## Features Implemented

1. **JWT Authentication**:
   - Dependency `get_current_user` that reads Authorization: Bearer token from header
   - Verifies and decodes JWT using the BETTER_AUTH_SECRET
   - Returns user_id from token (extracted from 'sub' claim)
   - Raises 401 error if token is invalid, expired, or missing

2. **Secure Task Routes**:
   - All task routes use the JWT authentication dependency
   - All queries filter by user_id extracted from JWT token (not from URL path)
   - Updated endpoints to `/api/tasks` (removed {user_id} from path for security)

3. **Authentication Endpoints**:
   - `/api/auth/sign-up` - Creates new user and returns JWT token
   - `/api/auth/sign-in` - Authenticates user and returns JWT token

4. **Task Management Endpoints**:
   - `GET /api/tasks` - Get all tasks for authenticated user with filtering
   - `GET /api/tasks/{task_id}` - Get specific task for authenticated user
   - `POST /api/tasks` - Create new task for authenticated user
   - `PUT /api/tasks/{task_id}` - Update specific task for authenticated user
   - `DELETE /api/tasks/{task_id}` - Delete specific task for authenticated user

## Files Created

- `main.py` - Main application entry point
- `app/main.py` - FastAPI application with routers
- `app/models.py` - Database models for User and Task
- `app/database.py` - Database configuration and session management
- `app/api/routers/auth.py` - Authentication endpoints and JWT utilities
- `app/api/routers/tasks.py` - Secure task endpoints with JWT authentication
- `requirements.txt` - Project dependencies
- `.env` - Environment configuration

## Setup Instructions

1. Install dependencies:
   ```bash
   pip install -r requirements.txt
   ```

2. Configure environment variables in `.env`:
   ```
   DATABASE_URL=sqlite:///./todo_app.db
   BETTER_AUTH_SECRET=your-super-secret-key-here-change-this-in-production
   ```

3. Run the development server:
   ```bash
   python main.py
   ```

## Security Considerations

- JWT tokens are verified using the same BETTER_AUTH_SECRET as the frontend
- All task endpoints require authentication via JWT token
- Queries are filtered by user_id extracted from the JWT token
- Passwords are hashed using bcrypt
- Proper error handling for unauthorized requests