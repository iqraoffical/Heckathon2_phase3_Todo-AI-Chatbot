# Task CRUD Operations Specification

## Overview
This document specifies the basic task management operations for the Todo application.

## Operations

### 1. Add Task
- **Endpoint**: `POST /api/{user_id}/tasks`
- **Request Body**:
  ```json
  {
    "title": "string",
    "description": "string",
    "due_date": "datetime (optional)"
  }
  ```
- **Response**: Created task object with ID
- **Authorization**: JWT token required

### 2. View Tasks
- **Endpoint**: `GET /api/{user_id}/tasks`
- **Query Parameters**:
  - `completed`: boolean (optional) - filter by completion status
  - `limit`: integer (optional) - number of records to return
  - `offset`: integer (optional) - offset for pagination
- **Response**: Array of task objects
- **Authorization**: JWT token required

### 3. Update Task
- **Endpoint**: `PUT /api/{user_id}/tasks/{task_id}`
- **Request Body**:
  ```json
  {
    "title": "string (optional)",
    "description": "string (optional)",
    "due_date": "datetime (optional)",
    "completed": "boolean (optional)"
  }
  ```
- **Response**: Updated task object
- **Authorization**: JWT token required

### 4. Delete Task
- **Endpoint**: `DELETE /api/{user_id}/tasks/{task_id}`
- **Response**: Success message
- **Authorization**: JWT token required

### 5. Mark Complete Task
- **Endpoint**: `PATCH /api/{user_id}/tasks/{task_id}/complete`
- **Request Body**:
  ```json
  {
    "completed": true
  }
  ```
- **Response**: Updated task object
- **Authorization**: JWT token required

## Error Handling
- Return appropriate HTTP status codes (400, 401, 403, 404, 500)
- Standardized error response format:
  ```json
  {
    "error": "error_message",
    "details": "additional_details"
  }
  ```