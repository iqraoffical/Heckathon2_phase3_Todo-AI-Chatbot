from typing import List, Optional
from datetime import datetime
from fastapi import APIRouter, Depends, HTTPException, status, Query
from sqlmodel import Session, select, desc, asc, or_
from sqlalchemy.sql.elements import ColumnElement
from sqlalchemy import and_, String
from ...models import Task, User, TaskUpdate
from ...database import get_session
from ...jwt_utils import get_current_user_from_token

router = APIRouter(prefix="/api")


def build_tasks_query(
    session: Session,
    user_id: str,
    search: Optional[str] = None,
    status: Optional[str] = "all",
    priority: Optional[str] = None,
    due_date_from: Optional[datetime] = None,
    due_date_to: Optional[datetime] = None,
    tags: Optional[List[str]] = None,
    category: Optional[str] = None,
    project_id: Optional[str] = None,
    sort_by: Optional[str] = "created",
    order: Optional[str] = "asc",
    skip: int = 0,
    limit: int = 100
) -> select:
    """
    Build a dynamic SQLModel query for retrieving tasks with filtering and sorting capabilities.

    Args:
        session: Database session
        user_id: ID of the authenticated user
        search: Keyword to search in title or description (case-insensitive)
        status: Filter by status ('all', 'pending', 'completed')
        priority: Filter by priority ('high', 'medium', 'low')
        due_date_from: Filter tasks with due date greater than or equal to this date
        due_date_to: Filter tasks with due date less than or equal to this date
        tags: Filter by tags (list of tag strings)
        category: Filter by category
        project_id: Filter by project ID
        sort_by: Sort by field ('created', 'due_date', 'priority', 'title')
        order: Sort order ('asc', 'desc')
        skip: Number of records to skip for pagination
        limit: Maximum number of records to return

    Returns:
        A SQLModel select query object ready for execution
    """
    # Start with a base query filtered by the current user
    query = select(Task).where(Task.user_id == user_id)

    # Apply search filter if provided (case-insensitive keyword search on title/description/tags)
    if search:
        from sqlalchemy import func
        # Search in title and description
        search_conditions = [
            Task.title.ilike(f"%{search}%"),
            Task.description.ilike(f"%{search}%")
        ]

        # Also search in tags array - check if any tag contains the search term as a substring
        # Using JSON operators to check if any element in the tags array contains the search term
        # Using jsonb_array_elements_text to iterate over array elements and check if any contains the search term
        search_conditions.append(
            func.exists(
                select(1)
                .select_from(func.jsonb_array_elements_text(Task.tags).alias('tag_elem'))
                .where(func.lower(func.column('tag_elem')).contains(func.lower(search)))
            )
        )

        query = query.where(or_(*search_conditions))

    # Apply status filter if provided
    # Note: The model uses "todo", "in_progress", "completed" as status values
    # Mapping "pending" to both "todo" and "in_progress" statuses
    if status and status != "all":
        if status == "pending":
            # Assuming "pending" means both "todo" and "in_progress" states
            query = query.where(Task.status.in_(["todo", "in_progress"]))
        elif status == "completed":
            query = query.where(Task.status == "completed")
        else:
            # Direct match for other status values
            query = query.where(Task.status == status)

    # Apply priority filter if provided
    if priority:
        query = query.where(Task.priority == priority)

    # Apply category filter if provided
    if category:
        query = query.where(Task.category == category)

    # Apply project_id filter if provided
    if project_id:
        query = query.where(Task.project_id == project_id)

    # Apply due date range filter if provided
    if due_date_from and due_date_to:
        # Both from and to dates provided - filter within range
        query = query.where(Task.due_date >= due_date_from).where(Task.due_date <= due_date_to)
    elif due_date_from:
        # Only from date provided - filter from this date onwards
        query = query.where(Task.due_date >= due_date_from)
    elif due_date_to:
        # Only to date provided - filter up to this date
        query = query.where(Task.due_date <= due_date_to)

    # Apply tags filter if provided
    if tags:
        # Using JSON field operators to check if any of the provided tags exist in the task's tags array
        # For JSONB arrays, we use the @> operator with individual elements or the ?| operator for any match
        from sqlalchemy import func
        # Build OR condition to check if any of the tags exist in the task's tags array
        tag_conditions = []
        for tag in tags:
            # Using the @> operator to check if the array contains the specific tag
            tag_array = func.jsonb_build_array(tag)
            tag_conditions.append(Task.tags.op('@>')(tag_array))

        if tag_conditions:
            query = query.where(or_(*tag_conditions))

    # Apply sorting with dynamic direction
    sort_column: Optional[ColumnElement] = None
    if sort_by == "due_date":
        sort_column = Task.due_date
    elif sort_by == "priority":
        sort_column = Task.priority
    elif sort_by == "title":
        sort_column = Task.title
    elif sort_by == "created":  # Map "created" to "created_at"
        sort_column = Task.created_at
    elif sort_by == "category":
        sort_column = Task.category
    elif sort_by == "project_id":
        sort_column = Task.project_id

    # Apply the sort with dynamic direction
    if sort_column is not None:
        if order.lower() == "desc":
            query = query.order_by(desc(sort_column))
        else:
            query = query.order_by(asc(sort_column))

    # Apply pagination
    query = query.offset(skip).limit(limit)

    return query


def get_filtered_tasks(
    session: Session,
    user_id: str,
    search: Optional[str] = None,
    status: Optional[str] = "all",
    priority: Optional[str] = None,
    due_date_from: Optional[datetime] = None,
    due_date_to: Optional[datetime] = None,
    tags: Optional[List[str]] = None,
    category: Optional[str] = None,
    project_id: Optional[str] = None,
    sort_by: Optional[str] = "created",
    order: Optional[str] = "asc",
    skip: int = 0,
    limit: int = 100
) -> list:
    """
    Execute the dynamic query and return the filtered tasks.

    Args:
        session: Database session
        user_id: ID of the authenticated user
        search: Keyword to search in title or description (case-insensitive)
        status: Filter by status ('all', 'pending', 'completed')
        priority: Filter by priority ('high', 'medium', 'low')
        due_date_from: Filter tasks with due date greater than or equal to this date
        due_date_to: Filter tasks with due date less than or equal to this date
        tags: Filter by tags (list of tag strings)
        category: Filter by category
        project_id: Filter by project ID
        sort_by: Sort by field ('created', 'due_date', 'priority', 'title')
        order: Sort order ('asc', 'desc')
        skip: Number of records to skip for pagination
        limit: Maximum number of records to return

    Returns:
        List of Task objects matching the criteria
    """
    query = build_tasks_query(
        session=session,
        user_id=user_id,
        search=search,
        status=status,
        priority=priority,
        due_date_from=due_date_from,
        due_date_to=due_date_to,
        tags=tags,
        category=category,
        project_id=project_id,
        sort_by=sort_by,
        order=order,
        skip=skip,
        limit=limit
    )

    return session.exec(query).all()


@router.get("/tasks", response_model=List[Task])
def get_tasks(
    current_user: User = Depends(get_current_user_from_token),
    session: Session = Depends(get_session),
    skip: int = 0,
    limit: int = 100,
    search: Optional[str] = Query(None, description="Keyword to search in title or description (case-insensitive)"),
    status: Optional[str] = Query("all", description="Filter by status: 'all', 'pending', or 'completed'"),
    priority: Optional[str] = Query(None, description="Filter by priority: 'high', 'medium', or 'low'"),
    category: Optional[str] = Query(None, description="Filter by category"),
    project_id: Optional[str] = Query(None, description="Filter by project ID"),
    due_date_from: Optional[str] = Query(None, description="Filter tasks with due date greater than or equal to this date (format: YYYY-MM-DD)"),
    due_date_to: Optional[str] = Query(None, description="Filter tasks with due date less than or equal to this date (format: YYYY-MM-DD)"),
    tags: Optional[List[str]] = Query(None, description="Filter by tags: comma-separated list of tags"),
    sort_by: Optional[str] = Query("created", description="Sort by field: 'created', 'due_date', 'priority', 'title', 'category', or 'project_id'"),
    order: Optional[str] = Query("asc", description="Sort order: 'asc' or 'desc'")
):
    """
    Get all tasks for the current user with optional filtering and sorting.
    """
    # Parse date strings to datetime objects if provided
    parsed_due_date_from = None
    parsed_due_date_to = None

    if due_date_from:
        try:
            parsed_due_date_from = datetime.fromisoformat(due_date_from.replace("Z", "+00:00"))
        except ValueError:
            try:
                # Handle date-only format (YYYY-MM-DD)
                parsed_due_date_from = datetime.strptime(due_date_from, "%Y-%m-%d")
            except ValueError:
                raise HTTPException(
                    status_code=status.HTTP_400_BAD_REQUEST,
                    detail=f"Invalid date format for due_date_from: {due_date_from}. Expected format: YYYY-MM-DD"
                )

    if due_date_to:
        try:
            parsed_due_date_to = datetime.fromisoformat(due_date_to.replace("Z", "+00:00"))
        except ValueError:
            try:
                # Handle date-only format (YYYY-MM-DD)
                parsed_due_date_to = datetime.strptime(due_date_to, "%Y-%m-%d")
            except ValueError:
                raise HTTPException(
                    status_code=status.HTTP_400_BAD_REQUEST,
                    detail=f"Invalid date format for due_date_to: {due_date_to}. Expected format: YYYY-MM-DD"
                )

    tasks = get_filtered_tasks(
        session=session,
        user_id=current_user.id,
        search=search,
        status=status,
        priority=priority,
        due_date_from=parsed_due_date_from,
        due_date_to=parsed_due_date_to,
        tags=tags,
        category=category,
        project_id=project_id,
        sort_by=sort_by,
        order=order,
        skip=skip,
        limit=limit
    )
    return tasks

@router.get("/tasks/{task_id}", response_model=Task)
def get_task(
    task_id: str,
    current_user: User = Depends(get_current_user_from_token),
    session: Session = Depends(get_session)
):
    """
    Get a specific task by ID for the current user.
    """
    task = session.exec(
        select(Task).where(Task.id == task_id, Task.user_id == current_user.id)
    ).first()

    if not task:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Task not found"
        )

    return task

@router.post("/tasks", response_model=Task, status_code=status.HTTP_201_CREATED)
def create_task(
    task: Task,
    current_user: User = Depends(get_current_user_from_token),
    session: Session = Depends(get_session)
):
    """
    Create a new task for the current user.
    """
    # Ensure the task is assigned to the current user
    task.user_id = current_user.id
    session.add(task)
    session.commit()
    session.refresh(task)
    return task

@router.put("/tasks/{task_id}", response_model=Task)
def update_task(
    task_id: str,
    task_update: TaskUpdate,
    current_user: User = Depends(get_current_user_from_token),
    session: Session = Depends(get_session)
):
    """
    Update a specific task for the current user.
    """
    # Retrieve the existing task
    existing_task = session.exec(
        select(Task).where(Task.id == task_id, Task.user_id == current_user.id)
    ).first()

    if not existing_task:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Task not found"
        )

    # Update the task with the provided data
    for var, value in task_update.dict(exclude_unset=True).items():
        setattr(existing_task, var, value)

    session.add(existing_task)
    session.commit()
    session.refresh(existing_task)
    return existing_task

@router.delete("/tasks/{task_id}", status_code=status.HTTP_200_OK)
def delete_task(
    task_id: str,
    current_user: User = Depends(get_current_user_from_token),
    session: Session = Depends(get_session)
):
    """
    Delete a specific task for the current user.
    """
    task = session.exec(
        select(Task).where(Task.id == task_id, Task.user_id == current_user.id)
    ).first()

    if not task:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Task not found"
        )

    session.delete(task)
    session.commit()
    return {"message": "Task deleted successfully"}

@router.patch("/tasks/{task_id}/complete", response_model=Task)
def complete_task(
    task_id: str,
    current_user: User = Depends(get_current_user_from_token),
    session: Session = Depends(get_session)
):
    """
    Toggle the completion status of a specific task for the current user.
    """
    # Retrieve the existing task
    existing_task = session.exec(
        select(Task).where(Task.id == task_id, Task.user_id == current_user.id)
    ).first()

    if not existing_task:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Task not found"
        )

    # Toggle the status between 'completed' and 'todo'
    if existing_task.status == "completed":
        existing_task.status = "todo"
    else:
        existing_task.status = "completed"

    # Update the updated_at timestamp
    existing_task.updated_at = datetime.utcnow()

    session.add(existing_task)
    session.commit()
    session.refresh(existing_task)
    return existing_task