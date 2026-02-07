from typing import List, Optional
from fastapi import APIRouter, Depends, HTTPException, status, Query
from sqlmodel import Session, select, desc, asc, or_
from sqlalchemy.sql.elements import ColumnElement
from ...models import Project, ProjectRead, ProjectBase, ProjectUpdate, User
from ...database import get_session
from ...jwt_utils import get_current_user_from_token

router = APIRouter(prefix="/api")


def build_projects_query(
    session: Session,
    user_id: str,
    search: Optional[str] = None,
    sort_by: Optional[str] = "created",
    order: Optional[str] = "asc",
    skip: int = 0,
    limit: int = 100
) -> select:
    """
    Build a dynamic SQLModel query for retrieving projects with filtering and sorting capabilities.

    Args:
        session: Database session
        user_id: ID of the authenticated user
        search: Keyword to search in name or description (case-insensitive)
        sort_by: Sort by field ('created', 'name', 'updated')
        order: Sort order ('asc', 'desc')
        skip: Number of records to skip for pagination
        limit: Maximum number of records to return

    Returns:
        A SQLModel select query object ready for execution
    """
    # Start with a base query filtered by the current user
    query = select(Project).where(Project.user_id == user_id)

    # Apply search filter if provided (case-insensitive keyword search on name/description)
    if search:
        from sqlalchemy import func
        # Search in name and description
        search_conditions = [
            Project.name.ilike(f"%{search}%"),
            Project.description.ilike(f"%{search}%")
        ]

        query = query.where(or_(*search_conditions))

    # Apply sorting with dynamic direction
    sort_column: Optional[ColumnElement] = None
    if sort_by == "name":
        sort_column = Project.name
    elif sort_by == "created":  # Map "created" to "created_at"
        sort_column = Project.created_at
    elif sort_by == "updated":  # Map "updated" to "updated_at"
        sort_column = Project.updated_at

    # Apply the sort with dynamic direction
    if sort_column is not None:
        if order.lower() == "desc":
            query = query.order_by(desc(sort_column))
        else:
            query = query.order_by(asc(sort_column))

    # Apply pagination
    query = query.offset(skip).limit(limit)

    return query


def get_filtered_projects(
    session: Session,
    user_id: str,
    search: Optional[str] = None,
    sort_by: Optional[str] = "created",
    order: Optional[str] = "asc",
    skip: int = 0,
    limit: int = 100
) -> list:
    """
    Execute the dynamic query and return the filtered projects.

    Args:
        session: Database session
        user_id: ID of the authenticated user
        search: Keyword to search in name or description (case-insensitive)
        sort_by: Sort by field ('created', 'name', 'updated')
        order: Sort order ('asc', 'desc')
        skip: Number of records to skip for pagination
        limit: Maximum number of records to return

    Returns:
        List of Project objects matching the criteria
    """
    query = build_projects_query(
        session=session,
        user_id=user_id,
        search=search,
        sort_by=sort_by,
        order=order,
        skip=skip,
        limit=limit
    )

    return session.exec(query).all()


@router.get("/projects", response_model=List[ProjectRead])
def get_projects(
    current_user: User = Depends(get_current_user_from_token),
    session: Session = Depends(get_session),
    skip: int = 0,
    limit: int = 100,
    search: Optional[str] = Query(None, description="Keyword to search in name or description (case-insensitive)"),
    sort_by: Optional[str] = Query("created", description="Sort by field: 'created', 'name', or 'updated'"),
    order: Optional[str] = Query("asc", description="Sort order: 'asc' or 'desc'")
):
    """
    Get all projects for the current user with optional filtering and sorting.
    """
    projects = get_filtered_projects(
        session=session,
        user_id=current_user.id,
        search=search,
        sort_by=sort_by,
        order=order,
        skip=skip,
        limit=limit
    )
    return projects


@router.get("/projects/{project_id}", response_model=ProjectRead)
def get_project(
    project_id: str,
    current_user: User = Depends(get_current_user_from_token),
    session: Session = Depends(get_session)
):
    """
    Get a specific project by ID for the current user.
    """
    project = session.exec(
        select(Project).where(Project.id == project_id, Project.user_id == current_user.id)
    ).first()

    if not project:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Project not found"
        )

    return project


@router.post("/projects", response_model=ProjectRead, status_code=status.HTTP_201_CREATED)
def create_project(
    project: ProjectBase,
    current_user: User = Depends(get_current_user_from_token),
    session: Session = Depends(get_session)
):
    """
    Create a new project for the current user.
    """
    # Ensure the project is assigned to the current user
    db_project = Project(**project.dict(), user_id=current_user.id)
    session.add(db_project)
    session.commit()
    session.refresh(db_project)
    return db_project


@router.put("/projects/{project_id}", response_model=ProjectRead)
def update_project(
    project_id: str,
    project_update: ProjectUpdate,
    current_user: User = Depends(get_current_user_from_token),
    session: Session = Depends(get_session)
):
    """
    Update a specific project for the current user.
    """
    # Retrieve the existing project
    existing_project = session.exec(
        select(Project).where(Project.id == project_id, Project.user_id == current_user.id)
    ).first()

    if not existing_project:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Project not found"
        )

    # Update the project with the provided data
    for var, value in project_update.dict(exclude_unset=True).items():
        setattr(existing_project, var, value)

    session.add(existing_project)
    session.commit()
    session.refresh(existing_project)
    return existing_project


@router.delete("/projects/{project_id}", status_code=status.HTTP_200_OK)
def delete_project(
    project_id: str,
    current_user: User = Depends(get_current_user_from_token),
    session: Session = Depends(get_session)
):
    """
    Delete a specific project for the current user.
    """
    project = session.exec(
        select(Project).where(Project.id == project_id, Project.user_id == current_user.id)
    ).first()

    if not project:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Project not found"
        )

    session.delete(project)
    session.commit()
    return {"message": "Project deleted successfully"}