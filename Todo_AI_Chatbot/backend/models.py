from sqlmodel import SQLModel, Field, create_engine, Session, select
from sqlalchemy import func
from typing import Optional
import uuid
from datetime import datetime
from pydantic import BaseModel
from enum import Enum


class UserRole(str, Enum):
    USER = "user"
    ASSISTANT = "assistant"


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


class ConversationBase(SQLModel):
    title: str | None = Field(default=None, max_length=255)


class Conversation(ConversationBase, table=True):
    id: uuid.UUID = Field(default_factory=uuid.uuid4, primary_key=True)
    user_id: uuid.UUID = Field(foreign_key="users.id", ondelete="CASCADE")
    created_at: datetime = Field(default=datetime.utcnow())
    updated_at: datetime = Field(default=datetime.utcnow())

    __tablename__ = "conversations"


class MessageBase(SQLModel):
    role: str = Field(max_length=50, nullable=False)  # 'user' or 'assistant'
    content: str = Field(nullable=False)


class Message(MessageBase, table=True):
    id: uuid.UUID = Field(default_factory=uuid.uuid4, primary_key=True)
    conversation_id: uuid.UUID = Field(foreign_key="conversations.id", ondelete="CASCADE")
    timestamp: datetime = Field(default=datetime.utcnow())

    __tablename__ = "messages"


# Pydantic models for API requests/responses
class TaskCreate(TaskBase):
    pass


class TaskUpdate(BaseModel):
    title: str | None = None
    description: str | None = None
    completed: bool | None = None
    due_date: datetime | None = None


class TaskResponse(TaskBase):
    id: uuid.UUID
    user_id: uuid.UUID
    created_at: datetime
    updated_at: datetime


class UserResponse(UserBase):
    id: uuid.UUID
    created_at: datetime
    updated_at: datetime


class ConversationResponse(ConversationBase):
    id: uuid.UUID
    user_id: uuid.UUID
    created_at: datetime
    updated_at: datetime


class MessageResponse(MessageBase):
    id: uuid.UUID
    conversation_id: uuid.UUID
    timestamp: datetime


class ChatRequest(BaseModel):
    message: str


class ChatResponse(BaseModel):
    response: str
    conversation_id: uuid.UUID