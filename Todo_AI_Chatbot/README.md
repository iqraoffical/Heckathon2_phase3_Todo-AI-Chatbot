# Task Manager App with Python Backend

A secure task management application built with Next.js frontend and Python FastAPI backend.

## Features

- User authentication with email/password (handled by Python backend)
- JWT-based session management
- Protected routes
- Responsive UI with Tailwind CSS
- Task management functionality

## Prerequisites

- Node.js (v18 or higher)
- Python 3.8+
- npm or yarn

## Setup Instructions

### 1. Backend Setup

First, start your Python backend:

```bash
cd backend
python -m venv venv
source venv/bin/activate  # On Windows: venv\Scripts\activate
pip install -r requirements.txt
uvicorn app.main:app --reload --port 8000
```

### 2. Frontend Setup

In a new terminal, navigate to the project root and set up the frontend:

```bash
npm install
```

### 3. Environment Variables

Update the values in `.env.local`:
- `NEXT_PUBLIC_API_BASE_URL`: URL of your Python backend (default: http://localhost:8000)

### 4. Run the Development Server

```bash
npm run dev
```

### 5. Access the Application

Open [http://localhost:3000](http://localhost:3000) in your browser.

## Available Pages

- `/` - Home page with sign in/up options
- `/signin` - Sign in page
- `/signup` - Sign up page
- `/tasks` - Protected tasks page

## Troubleshooting

### "Failed to fetch" error on sign-in

This error typically occurs due to:
- Backend server not running on the configured port
- Incorrect `NEXT_PUBLIC_API_BASE_URL` in environment variables
- CORS issues

Make sure your Python backend is running on the port specified in `NEXT_PUBLIC_API_BASE_URL`.

### Redirect issues on protected routes

If you're being redirected to the sign-in page even when logged in:
- Clear your browser cache and cookies
- Ensure your environment variables are properly set
- Verify that the backend authentication endpoints are accessible

## Project Structure

```
app/
├── signin/page.tsx                     # Sign in page
├── signup/page.tsx                     # Sign up page
├── tasks/page.tsx                      # Protected tasks page
├── layout.tsx                          # Root layout
├── page.tsx                           # Home page
└── globals.css                        # Global styles
lib/
└── auth-client.ts                     # Client for Python backend auth
middleware.ts                          # Authentication middleware
.env.local                             # Environment variables
backend/                               # Python FastAPI backend
```

## Security Notes

- Change the default secrets in your Python backend before deploying to production
- Use HTTPS in production environments
- Regularly update dependencies to patch security vulnerabilities