# Todo AI Chatbot

A comprehensive task management application with AI-powered chatbot functionality.

## Features

- **Task Management**: Create, read, update, delete, and mark tasks as complete
- **AI Chatbot**: Natural language interface to manage tasks using OpenAI
- **Authentication**: Secure user authentication with Better Auth
- **Responsive UI**: Mobile-friendly interface built with React and Tailwind CSS
- **Real-time Updates**: Live updates for task management

## Architecture

This is a monorepo project with the following structure:

```
Todo_AI_Chatbot/
├── specs/                    # Specification documents
│   ├── task-crud.md         # Task CRUD operations spec
│   ├── rest-endpoints.md    # REST API endpoints spec
│   └── schema.md            # Database schema spec
├── backend/                 # FastAPI backend
│   ├── main.py              # Application entry point
│   ├── models.py            # Database models
│   ├── db.py                # Database setup
│   ├── routes/              # API routes
│   ├── auth.py              # Authentication utilities
│   ├── config.py            # Configuration
│   ├── mcp_tools.py         # MCP tools implementation
│   └── ai_agents.py         # AI agents integration
├── frontend/                # Next.js frontend
│   ├── pages/               # Page components
│   ├── components/          # Reusable components
│   ├── lib/                 # Utilities and services
│   └── styles/              # Styling
├── app/                     # Next.js app directory
└── README.md               # This file
```

## Setup Instructions

### Backend Setup

1. Navigate to the backend directory:
```bash
cd backend
```

2. Install Python dependencies:
```bash
pip install -r requirements.txt
```

3. Set up environment variables in `.env`:
```env
BETTER_AUTH_SECRET=S4paj8zsSf3ZIK0bKIwthxQjXzdbhjMI
DATABASE_URL=postgresql://neondb_owner:npg_FBcnSA3wM0Tk@ep-jolly-rain-a7lzfvk3-pooler.ap-southeast-2.aws.neon.tech/neondb?sslmode=require&channel_binding=require
API_URL=http://localhost:8000
OPENAI_API_KEY=your_openai_api_key_here
```

4. Start the backend server:
```bash
uvicorn main:app --reload --port 8000
```

### Frontend Setup

1. Navigate to the frontend directory:
```bash
cd frontend
```

2. Install JavaScript dependencies:
```bash
npm install
```

3. Set up environment variables in `.env.local`:
```env
NEXT_PUBLIC_API_BASE_URL=http://localhost:8000
NEXT_PUBLIC_BETTER_AUTH_URL=http://localhost:3000
NEXT_PUBLIC_JWT_SECRET=cb596cc800d58094bdcdcc48f89f48e1158fc6ad17b49cdee775b50eff63858a
NEXT_PUBLIC_BASE_URL=http://localhost:3000
```

4. Start the frontend development server:
```bash
npm run dev
```

## API Endpoints

The backend provides the following RESTful API endpoints:

### Task Management
- `POST /api/{user_id}/tasks` - Create a new task
- `GET /api/{user_id}/tasks` - Get all tasks for a user
- `GET /api/{user_id}/tasks/{task_id}` - Get a specific task
- `PUT /api/{user_id}/tasks/{task_id}` - Update a task
- `DELETE /api/{user_id}/tasks/{task_id}` - Delete a task
- `PATCH /api/{user_id}/tasks/{task_id}/complete` - Mark a task as complete

### Chat Interface
- `POST /api/{user_id}/chat` - Send a message to the AI chatbot

All endpoints require authentication via JWT token in the Authorization header.

## MCP Tools

The AI chatbot uses the following MCP (Model Context Protocol) tools:

- `add_task(title, description, due_date)` - Add a new task
- `list_tasks(completed)` - List tasks (filter by completion status)
- `complete_task(task_id)` - Mark a task as complete
- `delete_task(task_id)` - Delete a task
- `update_task(task_id, title, description, due_date, completed)` - Update a task

## Technologies Used

### Backend
- FastAPI - Web framework
- SQLModel - Database ORM
- PostgreSQL (Neon) - Database
- Better Auth - Authentication
- OpenAI API - AI capabilities
- uvicorn - ASGI server

### Frontend
- Next.js - React framework
- React - UI library
- Tailwind CSS - Styling
- TypeScript - Type safety
- Axios - HTTP client

## Development

To contribute to this project:

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/amazing-feature`)
3. Make your changes
4. Commit your changes (`git commit -m 'Add some amazing feature'`)
5. Push to the branch (`git push origin feature/amazing-feature`)
6. Open a Pull Request

## License

This project is licensed under the MIT License.