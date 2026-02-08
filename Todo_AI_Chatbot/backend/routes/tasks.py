from fastapi import APIRouter, Depends, HTTPException, status
from sqlmodel import Session, select
from typing import List
from auth import get_current_user_id
from models import Task, TaskCreate, TaskUpdate, TaskResponse
from db import get_session
import uuid
from datetime import datetime

router = APIRouter()


@router.post("/tasks", response_model=TaskResponse)
async def create_task(
    user_id: uuid.UUID,
    task: TaskCreate,
    session: Session = Depends(get_session)
):
    # Verify that the user_id in the path matches the authenticated user
    current_user_id = get_current_user_id()
    if current_user_id != user_id:
        raise HTTPException(
            status_code=status.HTTP_403_FORBIDDEN,
            detail="Not authorized to create tasks for this user"
        )
    
    # Create task object with user_id
    db_task = Task(
        title=task.title,
        description=task.description,
        completed=task.completed,
        due_date=task.due_date,
        user_id=user_id
    )
    session.add(db_task)
    session.commit()
    session.refresh(db_task)
    
    return db_task


@router.get("/tasks", response_model=List[TaskResponse])
async def read_tasks(
    user_id: uuid.UUID,
    completed: bool = None,
    limit: int = 100,
    offset: int = 0,
    session: Session = Depends(get_session)
):
    # Verify that the user_id in the path matches the authenticated user
    current_user_id = get_current_user_id()
    if current_user_id != user_id:
        raise HTTPException(
            status_code=status.HTTP_403_FORBIDDEN,
            detail="Not authorized to view tasks for this user"
        )
    
    query = select(Task).where(Task.user_id == user_id)
    
    if completed is not None:
        query = query.where(Task.completed == completed)
    
    query = query.offset(offset).limit(limit)
    
    tasks = session.exec(query).all()
    return tasks


@router.get("/tasks/{task_id}", response_model=TaskResponse)
async def read_task(
    user_id: uuid.UUID,
    task_id: uuid.UUID,
    session: Session = Depends(get_session)
):
    # Verify that the user_id in the path matches the authenticated user
    current_user_id = get_current_user_id()
    if current_user_id != user_id:
        raise HTTPException(
            status_code=status.HTTP_403_FORBIDDEN,
            detail="Not authorized to view tasks for this user"
        )
    
    task = session.exec(
        select(Task).where(Task.id == task_id, Task.user_id == user_id)
    ).first()
    
    if not task:
        raise HTTPException(status_code=404, detail="Task not found")
    
    return task


@router.put("/tasks/{task_id}", response_model=TaskResponse)
async def update_task(
    user_id: uuid.UUID,
    task_id: uuid.UUID,
    task_update: TaskUpdate,
    session: Session = Depends(get_session)
):
    # Verify that the user_id in the path matches the authenticated user
    current_user_id = get_current_user_id()
    if current_user_id != user_id:
        raise HTTPException(
            status_code=status.HTTP_403_FORBIDDEN,
            detail="Not authorized to update tasks for this user"
        )
    
    db_task = session.exec(
        select(Task).where(Task.id == task_id, Task.user_id == user_id)
    ).first()
    
    if not db_task:
        raise HTTPException(status_code=404, detail="Task not found")
    
    # Update task fields
    update_data = task_update.model_dump(exclude_unset=True)
    for field, value in update_data.items():
        setattr(db_task, field, value)
    
    db_task.updated_at = datetime.utcnow()
    session.add(db_task)
    session.commit()
    session.refresh(db_task)
    
    return db_task


@router.delete("/tasks/{task_id}")
async def delete_task(
    user_id: uuid.UUID,
    task_id: uuid.UUID,
    session: Session = Depends(get_session)
):
    # Verify that the user_id in the path matches the authenticated user
    current_user_id = get_current_user_id()
    if current_user_id != user_id:
        raise HTTPException(
            status_code=status.HTTP_403_FORBIDDEN,
            detail="Not authorized to delete tasks for this user"
        )
    
    task = session.exec(
        select(Task).where(Task.id == task_id, Task.user_id == user_id)
    ).first()
    
    if not task:
        raise HTTPException(status_code=404, detail="Task not found")
    
    session.delete(task)
    session.commit()
    
    return {"message": "Task deleted successfully"}


@router.patch("/tasks/{task_id}/complete", response_model=TaskResponse)
async def complete_task(
    user_id: uuid.UUID,
    task_id: uuid.UUID,
    session: Session = Depends(get_session)
):
    # Verify that the user_id in the path matches the authenticated user
    current_user_id = get_current_user_id()
    if current_user_id != user_id:
        raise HTTPException(
            status_code=status.HTTP_403_FORBIDDEN,
            detail="Not authorized to update tasks for this user"
        )
    
    db_task = session.exec(
        select(Task).where(Task.id == task_id, Task.user_id == user_id)
    ).first()
    
    if not db_task:
        raise HTTPException(status_code=404, detail="Task not found")
    
    db_task.completed = True
    db_task.updated_at = datetime.utcnow()
    session.add(db_task)
    session.commit()
    session.refresh(db_task)
    
    return db_task