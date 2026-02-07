# TaskFlow - Multi-User Todo Web Application

## Project Overview
TaskFlow is a modern, multi-user todo web application with persistent storage, featuring authentication, task management, and collaborative features.

## Core Features

### Basic Level (Core Essentials)
1. **Add Task** – Create new todo items with title, description, due date, priority, and tags
2. **Delete Task** – Remove tasks from the list with confirmation
3. **Update Task** – Modify existing task details (title, description, due date, priority, tags)
4. **View Task List** – Display all tasks with filtering and sorting options
5. **Mark as Complete** – Toggle task completion status

### Intermediate Level (Organization & Usability)
6. **Priorities & Tags/Categories** – Assign priority levels (high/medium/low) and custom tags
7. **Search & Filter** – Search by keyword; filter by status, priority, or date
8. **Sort Tasks** – Reorder by due date, priority, or alphabetically

## Technical Requirements

### Backend
- **Framework**: Next.js App Router with API routes
- **Database**: Neon Serverless PostgreSQL
- **ORM**: Prisma
- **Authentication**: Better Auth
- **API**: RESTful endpoints

### Frontend
- **Framework**: React with TypeScript
- **Styling**: Tailwind CSS with shadcn/ui components
- **State Management**: React hooks and client-side state
- **Animations**: Framer Motion

### Database Schema
```sql
-- Users table
CREATE TABLE users (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name VARCHAR(255) NOT NULL,
  email VARCHAR(255) UNIQUE NOT NULL,
  password_hash TEXT NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- Tasks table
CREATE TABLE tasks (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES users(id) ON DELETE CASCADE,
  title VARCHAR(255) NOT NULL,
  description TEXT,
  status VARCHAR(20) DEFAULT 'todo', -- 'todo', 'in_progress', 'completed'
  priority VARCHAR(20) DEFAULT 'medium', -- 'low', 'medium', 'high'
  due_date TIMESTAMP WITH TIME ZONE,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- Tags table
CREATE TABLE tags (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name VARCHAR(50) UNIQUE NOT NULL,
  color VARCHAR(7) -- hex color code
);

-- Task-Tags junction table
CREATE TABLE task_tags (
  task_id UUID REFERENCES tasks(id) ON DELETE CASCADE,
  tag_id UUID REFERENCES tags(id) ON DELETE CASCADE,
  PRIMARY KEY (task_id, tag_id)
);
```

### API Endpoints
#### Authentication
- `POST /api/auth/signup` - User registration
- `POST /api/auth/signin` - User login
- `POST /api/auth/signout` - User logout
- `GET /api/auth/me` - Get current user

#### Tasks
- `GET /api/tasks` - Get all tasks for current user (with filters, pagination, sorting)
- `POST /api/tasks` - Create a new task
- `GET /api/tasks/:id` - Get a specific task
- `PUT /api/tasks/:id` - Update a specific task
- `DELETE /api/tasks/:id` - Delete a specific task
- `PATCH /api/tasks/:id/status` - Update task status

#### Tags
- `GET /api/tags` - Get all tags for current user
- `POST /api/tags` - Create a new tag
- `DELETE /api/tags/:id` - Delete a tag

### Frontend Components
- **TaskList** - Displays tasks with filtering and sorting
- **TaskCard** - Individual task component with status toggle
- **TaskForm** - Form for creating/editing tasks
- **TagManager** - Component for managing tags
- **SearchFilter** - Component for search and filtering
- **AuthForms** - Login/signup forms
- **UserProfile** - User profile and settings

### User Interface
- **Responsive Design**: Works on mobile, tablet, and desktop
- **Dark/Light Mode**: Theme switching capability
- **Task Views**: List view and grid view options
- **Notifications**: Success/error messages
- **Loading States**: Skeleton loaders for better UX

### Security
- Password hashing using bcrypt or similar
- JWT tokens for session management
- Input validation and sanitization
- Rate limiting for API endpoints
- CSRF protection

### Performance
- Server-side rendering where appropriate
- Client-side caching
- Optimistic updates for better UX
- Lazy loading for components
- Image optimization

## Development Phases

### Phase 1: Foundation
- Set up project structure
- Configure database and ORM
- Implement authentication
- Create basic UI components

### Phase 2: Core Features
- Implement CRUD operations for tasks
- Add task status management
- Create task list view

### Phase 3: Enhancement
- Add tagging system
- Implement search and filtering
- Add sorting capabilities
- Polish UI/UX

### Phase 4: Optimization
- Add animations and transitions
- Implement performance optimizations
- Add error boundaries and loading states
- Testing and debugging

## Deployment
- Environment configuration
- Database migration scripts
- Production build process
- CI/CD pipeline considerations