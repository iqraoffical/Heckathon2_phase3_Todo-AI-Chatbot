# Database Schema Specification

## Overview
This document defines the database schema for the Todo application using SQLModel.

## Database
- PostgreSQL (Neon)
- Connection via DATABASE_URL environment variable

## Tables

### 1. Users Table
```sql
CREATE TABLE users (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    email VARCHAR(255) UNIQUE NOT NULL,
    password_hash VARCHAR(255) NOT NULL,
    first_name VARCHAR(100),
    last_name VARCHAR(100),
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);
```

### 2. Tasks Table
```sql
CREATE TABLE tasks (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    title VARCHAR(255) NOT NULL,
    description TEXT,
    completed BOOLEAN DEFAULT FALSE,
    due_date TIMESTAMP WITH TIME ZONE,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);
```

### 3. Conversations Table
```sql
CREATE TABLE conversations (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    title VARCHAR(255),
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);
```

### 4. Messages Table
```sql
CREATE TABLE messages (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    conversation_id UUID NOT NULL REFERENCES conversations(id) ON DELETE CASCADE,
    role VARCHAR(50) NOT NULL, -- 'user' or 'assistant'
    content TEXT NOT NULL,
    timestamp TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);
```

## Indexes
- Index on `users.email` for quick lookup
- Index on `tasks.user_id` for efficient filtering by user
- Index on `conversations.user_id` for efficient filtering by user
- Index on `messages.conversation_id` for efficient retrieval of conversation history

## SQLModel Definitions

### User Model
```python
from sqlmodel import SQLModel, Field
from datetime import datetime
import uuid

class UserBase(SQLModel):
    email: str = Field(unique=True, nullable=False)
    first_name: str | None = None
    last_name: str | None = None

class User(UserBase, table=True):
    id: uuid.UUID = Field(default_factory=uuid.uuid4, primary_key=True)
    password_hash: str = Field(nullable=False)
    created_at: datetime = Field(default=datetime.utcnow())
    updated_at: datetime = Field(default=datetime.utcnow())
    
    __tablename__ = "users"
```

### Task Model
```python
from sqlmodel import SQLModel, Field
from datetime import datetime
import uuid

class TaskBase(SQLModel):
    title: str = Field(max_length=255, nullable=False)
    description: str | None = Field(default=None)
    completed: bool = Field(default=False)
    due_date: datetime | None = Field(default=None)

class Task(TaskBase, table=True):
    id: uuid.UUID = Field(default_factory=uuid.uuid4, primary_key=True)
    user_id: uuid.UUID = Field(foreign_key="users.id", ondelete="CASCADE")
    created_at: datetime = Field(default=datetime.utcnow())
    updated_at: datetime = Field(default=datetime.utcnow())
    
    __tablename__ = "tasks"
```

### Conversation Model
```python
from sqlmodel import SQLModel, Field
from datetime import datetime
import uuid

class ConversationBase(SQLModel):
    title: str | None = Field(default=None, max_length=255)

class Conversation(ConversationBase, table=True):
    id: uuid.UUID = Field(default_factory=uuid.uuid4, primary_key=True)
    user_id: uuid.UUID = Field(foreign_key="users.id", ondelete="CASCADE")
    created_at: datetime = Field(default=datetime.utcnow())
    updated_at: datetime = Field(default=datetime.utcnow())
    
    __tablename__ = "conversations"
```

### Message Model
```python
from sqlmodel import SQLModel, Field
from datetime import datetime
import uuid

class MessageBase(SQLModel):
    role: str = Field(max_length=50, nullable=False)  # 'user' or 'assistant'
    content: str = Field(nullable=False)

class Message(MessageBase, table=True):
    id: uuid.UUID = Field(default_factory=uuid.uuid4, primary_key=True)
    conversation_id: uuid.UUID = Field(foreign_key="conversations.id", ondelete="CASCADE")
    timestamp: datetime = Field(default=datetime.utcnow())
    
    __tablename__ = "messages"
```