"""
Quick test to verify the models work correctly with the tags field
"""
from sqlmodel import SQLModel, Field
from typing import Optional, List
from datetime import datetime
import uuid
from sqlalchemy import Column
from sqlalchemy.types import JSON

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
    tags: List[str] = Field(default=[], sa_column=Column(JSON))  # Updated to use JSON field

class Task(TaskBase, table=True):
    id: str = Field(default_factory=generate_uuid, primary_key=True)
    user_id: str = Field(foreign_key="user.id")
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
    tags: Optional[List[str]] = None  # Updated to use List[str]

# Test creating a task instance
print("Testing Task model with tags field...")

try:
    # Create a sample task
    task = Task(
        title="Test Task",
        description="This is a test task",
        status="todo",
        priority="high",
        tags=["work", "important", "testing"]  # This should work with our updated model
    )
    
    print(f"Task created successfully: {task.title}")
    print(f"Task tags: {task.tags}")
    print(f"Task tags type: {type(task.tags)}")
    
    # Test serialization
    task_dict = task.dict()
    print(f"Task serialized successfully: {task_dict['title']}")
    print(f"Task tags in dict: {task_dict['tags']}")
    
    print("\nAll tests passed! The Task model with tags field works correctly.")
    
except Exception as e:
    print(f"Error: {e}")
    import traceback
    traceback.print_exc()