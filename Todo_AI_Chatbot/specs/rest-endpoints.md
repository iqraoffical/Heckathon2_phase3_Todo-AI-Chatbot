# RESTful Endpoints Specification

## Overview
This document defines all RESTful API endpoints for the Todo application with proper authentication.

## Authentication
- All endpoints require JWT token in Authorization header: `Bearer {token}`
- Token validation performed by Better Auth middleware
- User ID extracted from JWT claims for route authorization

## Base URL
- Production: `https://yourdomain.com/api/{user_id}`
- Development: `http://localhost:8000/api/{user_id}`

## Endpoints

### Task Management

#### 1. Create Task
- **Method**: `POST`
- **Path**: `/api/{user_id}/tasks`
- **Headers**:
  - `Content-Type: application/json`
  - `Authorization: Bearer {jwt_token}`
- **Request Body**:
  ```json
  {
    "title": "Task title",
    "description": "Task description (optional)",
    "due_date": "2023-12-31T10:00:00Z (optional)"
  }
  ```
- **Success Response**: `201 Created`
  ```json
  {
    "id": 1,
    "user_id": "{user_id}",
    "title": "Task title",
    "description": "Task description",
    "completed": false,
    "created_at": "2023-12-01T10:00:00Z",
    "updated_at": "2023-12-01T10:00:00Z",
    "due_date": "2023-12-31T10:00:00Z"
  }
  ```
- **Error Responses**: `400 Bad Request`, `401 Unauthorized`, `403 Forbidden`, `500 Internal Server Error`

#### 2. Get All Tasks
- **Method**: `GET`
- **Path**: `/api/{user_id}/tasks`
- **Headers**:
  - `Authorization: Bearer {jwt_token}`
- **Query Parameters**:
  - `completed`: boolean (filter by completion status)
  - `limit`: integer (pagination limit)
  - `offset`: integer (pagination offset)
- **Success Response**: `200 OK`
  ```json
  [
    {
      "id": 1,
      "user_id": "{user_id}",
      "title": "Task title",
      "description": "Task description",
      "completed": false,
      "created_at": "2023-12-01T10:00:00Z",
      "updated_at": "2023-12-01T10:00:00Z",
      "due_date": "2023-12-31T10:00:00Z"
    }
  ]
  ```
- **Error Responses**: `401 Unauthorized`, `403 Forbidden`, `500 Internal Server Error`

#### 3. Get Single Task
- **Method**: `GET`
- **Path**: `/api/{user_id}/tasks/{task_id}`
- **Headers**:
  - `Authorization: Bearer {jwt_token}`
- **Success Response**: `200 OK`
  ```json
  {
    "id": 1,
    "user_id": "{user_id}",
    "title": "Task title",
    "description": "Task description",
    "completed": false,
    "created_at": "2023-12-01T10:00:00Z",
    "updated_at": "2023-12-01T10:00:00Z",
    "due_date": "2023-12-31T10:00:00Z"
  }
  ```
- **Error Responses**: `401 Unauthorized`, `403 Forbidden`, `404 Not Found`, `500 Internal Server Error`

#### 4. Update Task
- **Method**: `PUT`
- **Path**: `/api/{user_id}/tasks/{task_id}`
- **Headers**:
  - `Content-Type: application/json`
  - `Authorization: Bearer {jwt_token}`
- **Request Body**:
  ```json
  {
    "title": "Updated task title (optional)",
    "description": "Updated task description (optional)",
    "due_date": "2023-12-31T10:00:00Z (optional)",
    "completed": false (optional)
  }
  ```
- **Success Response**: `200 OK`
  ```json
  {
    "id": 1,
    "user_id": "{user_id}",
    "title": "Updated task title",
    "description": "Updated task description",
    "completed": false,
    "created_at": "2023-12-01T10:00:00Z",
    "updated_at": "2023-12-02T15:30:00Z",
    "due_date": "2023-12-31T10:00:00Z"
  }
  ```
- **Error Responses**: `400 Bad Request`, `401 Unauthorized`, `403 Forbidden`, `404 Not Found`, `500 Internal Server Error`

#### 5. Delete Task
- **Method**: `DELETE`
- **Path**: `/api/{user_id}/tasks/{task_id}`
- **Headers**:
  - `Authorization: Bearer {jwt_token}`
- **Success Response**: `200 OK`
  ```json
  {
    "message": "Task deleted successfully"
  }
  ```
- **Error Responses**: `401 Unauthorized`, `403 Forbidden`, `404 Not Found`, `500 Internal Server Error`

#### 6. Mark Task Complete
- **Method**: `PATCH`
- **Path**: `/api/{user_id}/tasks/{task_id}/complete`
- **Headers**:
  - `Content-Type: application/json`
  - `Authorization: Bearer {jwt_token}`
- **Request Body**:
  ```json
  {
    "completed": true
  }
  ```
- **Success Response**: `200 OK`
  ```json
  {
    "id": 1,
    "user_id": "{user_id}",
    "title": "Task title",
    "description": "Task description",
    "completed": true,
    "created_at": "2023-12-01T10:00:00Z",
    "updated_at": "2023-12-02T16:00:00Z",
    "due_date": "2023-12-31T10:00:00Z"
  }
  ```
- **Error Responses**: `400 Bad Request`, `401 Unauthorized`, `403 Forbidden`, `404 Not Found`, `500 Internal Server Error`

### Chatbot Endpoints

#### 7. Chat Endpoint
- **Method**: `POST`
- **Path**: `/api/{user_id}/chat`
- **Headers**:
  - `Content-Type: application/json`
  - `Authorization: Bearer {jwt_token}`
- **Request Body**:
  ```json
  {
    "message": "User's message to the chatbot"
  }
  ```
- **Success Response**: `200 OK`
  ```json
  {
    "response": "Chatbot's response",
    "conversation_id": "uuid"
  }
  ```
- **Error Responses**: `400 Bad Request`, `401 Unauthorized`, `403 Forbidden`, `500 Internal Server Error`