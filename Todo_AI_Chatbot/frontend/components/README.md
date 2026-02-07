# Reusable Frontend Components

This directory contains reusable React components with Tailwind CSS for the Todo application. These components are generated using the Frontend Component Generator subagent and follow consistent design patterns.

## Components

### TaskCard.tsx
Displays a single task with:
- Title and description
- Priority badge with color coding
- Tags display
- Due date
- Complete checkbox
- Action buttons for status change and deletion

### TaskFilters.tsx
Provides filtering controls with:
- Search input field
- Status dropdown filter (All, To Do, In Progress, Completed)
- Priority dropdown filter (All, Low, Medium, High)
- Sort options (Created At, Due Date, Priority, Title)

### TaskList.tsx
Manages a list of tasks with:
- Fetches tasks from the API
- Applies client-side filtering and sorting
- Shows loading and error states
- Integrates with TaskCard and TaskFilters components

## Features

- Fully responsive design using Tailwind CSS
- Client components where interactivity is needed
- Integration with the API client in `/lib/api.ts`
- Optimistic UI updates
- Error handling and loading states
- Dark mode support
- Accessible markup