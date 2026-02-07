from sqlmodel import SQLModel, Field
from typing import Optional, List
from datetime import datetime
from sqlalchemy import Column, JSON
import uuid

def generate_uuid():
    return str(uuid.uuid4())

class UserBase(SQLModel):
    email: str = Field(unique=True, index=True)
    name: str

class User(UserBase, table=True):
    id: str = Field(default_factory=generate_uuid, primary_key=True)
    hashed_password: str
    created_at: datetime = Field(default_factory=datetime.utcnow)

class UserRead(UserBase):
    id: str
    created_at: datetime

class TaskBase(SQLModel):
    title: str
    description: Optional[str] = None
    status: str = Field(default="todo")  # todo, in_progress, completed
    priority: str = Field(default="medium")  # low, medium, high
    due_date: Optional[datetime] = None
    tags: List[str] = Field(default=[], sa_column=Column(JSON))
    category: Optional[str] = Field(default=None, max_length=50, description="Category of the task")
    estimated_time: Optional[int] = Field(default=None, description="Estimated time to complete task in minutes")
    actual_time_spent: Optional[int] = Field(default=0, description="Actual time spent on task in minutes")
    project_id: Optional[str] = Field(default=None, foreign_key="project.id", description="Project this task belongs to")

class Task(TaskBase, table=True):
    id: str = Field(default_factory=generate_uuid, primary_key=True)
    user_id: str = Field(foreign_key="user.id", nullable=False)  # Ensure user_id is not null
    created_at: datetime = Field(default_factory=datetime.utcnow)
    updated_at: datetime = Field(default_factory=datetime.utcnow)

class TaskRead(TaskBase):
    id: str
    user_id: str
    created_at: datetime
    updated_at: datetime

class TaskUpdate(SQLModel):
    title: Optional[str] = None
    description: Optional[str] = None
    status: Optional[str] = None
    priority: Optional[str] = None
    due_date: Optional[datetime] = None
    tags: Optional[List[str]] = None
    category: Optional[str] = None
    estimated_time: Optional[int] = None
    actual_time_spent: Optional[int] = None
    project_id: Optional[str] = None

class ProjectBase(SQLModel):
    name: str
    description: Optional[str] = None

class Project(ProjectBase, table=True):
    id: str = Field(default_factory=generate_uuid, primary_key=True)
    user_id: str = Field(foreign_key="user.id", nullable=False)
    created_at: datetime = Field(default_factory=datetime.utcnow)
    updated_at: datetime = Field(default_factory=datetime.utcnow)

class ProjectRead(ProjectBase):
    id: str
    user_id: str
    created_at: datetime
    updated_at: datetime

class ProjectUpdate(SQLModel):
    name: Optional[str] = None
    description: Optional[str] = None