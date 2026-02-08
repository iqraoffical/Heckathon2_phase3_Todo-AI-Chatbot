# MCP Server Specification

## Overview
The Model Context Protocol (MCP) server will serve as an intermediary between the AI agents and the task management system. It will expose standardized tools that AI agents can use to perform operations on tasks.

## MCP Server Architecture

### Dependencies
- `mcp` - Official Model Context Protocol SDK
- `openai` - OpenAI SDK for agent functionality
- Existing backend dependencies (FastAPI, SQLModel, etc.)

### Server Configuration
- Runs as a service alongside the main FastAPI application
- Exposes tools via MCP protocol
- Maintains connection with AI agents through standardized interfaces

## MCP Tools Specification

### 1. create_task
**Description**: Creates a new task based on natural language input
**Parameters**:
- `title` (string): Title of the task
- `description` (string, optional): Detailed description
- `due_date` (string, optional): Due date in ISO format
- `priority` (string, optional): Priority level (low, medium, high)
- `tags` (array, optional): Array of tags
- `category` (string, optional): Category of the task
- `project_id` (string, optional): Associated project ID

**Returns**: Task object with all properties

### 2. get_tasks
**Description**: Retrieves tasks with optional filtering
**Parameters**:
- `status` (string, optional): Filter by status (all, pending, completed)
- `priority` (string, optional): Filter by priority
- `category` (string, optional): Filter by category
- `project_id` (string, optional): Filter by project
- `due_date_from` (string, optional): Filter from due date
- `due_date_to` (string, optional): Filter to due date
- `tags` (array, optional): Filter by tags
- `search` (string, optional): Search keyword
- `sort_by` (string, optional): Sort field
- `order` (string, optional): Sort order (asc, desc)

**Returns**: Array of Task objects

### 3. update_task
**Description**: Updates an existing task
**Parameters**:
- `task_id` (string): ID of the task to update
- `updates` (object): Object containing fields to update

**Returns**: Updated Task object

### 4. delete_task
**Description**: Deletes a task
**Parameters**:
- `task_id` (string): ID of the task to delete

**Returns**: Success confirmation

### 5. complete_task
**Description**: Toggles completion status of a task
**Parameters**:
- `task_id` (string): ID of the task to update

**Returns**: Updated Task object

### 6. search_tasks
**Description**: Searches tasks based on query
**Parameters**:
- `query` (string): Search query

**Returns**: Array of matching Task objects

## Conversation State Management

### Database Schema
```python
class Conversation(SQLModel, table=True):
    id: str = Field(default_factory=generate_uuid, primary_key=True)
    user_id: str = Field(foreign_key="user.id", nullable=False)
    title: str = Field(default="New Conversation")
    created_at: datetime = Field(default_factory=datetime.utcnow)
    updated_at: datetime = Field(default_factory=datetime.utcnow)
    metadata: Dict = Field(default={})

class Message(SQLModel, table=True):
    id: str = Field(default_factory=generate_uuid, primary_key=True)
    conversation_id: str = Field(foreign_key="conversation.id", nullable=False)
    role: str = Field(nullable=False)  # "user", "assistant", "tool"
    content: str = Field(nullable=False)
    timestamp: datetime = Field(default_factory=datetime.utcnow)
    tool_calls: Optional[Dict] = Field(default=None)  # For tool call information
    tool_results: Optional[Dict] = Field(default=None)  # For tool results
```

## Implementation Plan

### Phase 1: MCP Server Foundation
1. Set up MCP server with basic configuration
2. Define tool schemas and handlers
3. Connect to existing database

### Phase 2: Tool Implementation
1. Implement all 6 MCP tools connecting to existing API
2. Add proper authentication and authorization
3. Add error handling and validation

### Phase 3: Conversation Management
1. Implement conversation state persistence
2. Add message history tracking
3. Integrate with chat endpoint

### Phase 4: Integration Testing
1. Test all tools individually
2. Test end-to-end conversation flow
3. Validate security and authorization