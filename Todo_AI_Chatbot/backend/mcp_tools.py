from typing import Dict, Any, List
from sqlmodel import Session, select
from models import Task, User
import uuid
from datetime import datetime


class MCPTools:
    """
    MCP (Model Context Protocol) Tools for task management
    Implements the required tools for the AI chatbot to interact with tasks
    """
    
    def __init__(self, user_id: uuid.UUID, db_session: Session):
        self.user_id = user_id
        self.db_session = db_session
    
    def add_task(self, title: str, description: str = None, due_date: str = None) -> Dict[str, Any]:
        """
        Add a new task for the user
        
        Args:
            title: Title of the task
            description: Optional description of the task
            due_date: Optional due date in ISO format (YYYY-MM-DDTHH:MM:SS.sssZ)
        
        Returns:
            Dictionary with task information
        """
        try:
            # Parse due date if provided
            parsed_due_date = None
            if due_date:
                parsed_due_date = datetime.fromisoformat(due_date.replace('Z', '+00:00'))
            
            # Create new task
            task = Task(
                title=title,
                description=description,
                due_date=parsed_due_date,
                user_id=self.user_id
            )
            
            self.db_session.add(task)
            self.db_session.commit()
            self.db_session.refresh(task)
            
            return {
                "success": True,
                "task_id": str(task.id),
                "message": f"Task '{title}' added successfully"
            }
        except Exception as e:
            return {
                "success": False,
                "message": f"Error adding task: {str(e)}"
            }
    
    def list_tasks(self, completed: bool = None) -> List[Dict[str, Any]]:
        """
        List tasks for the user
        
        Args:
            completed: Filter by completion status (None for all, True for completed, False for incomplete)
        
        Returns:
            List of task dictionaries
        """
        try:
            query = select(Task).where(Task.user_id == self.user_id)
            
            if completed is not None:
                query = query.where(Task.completed == completed)
            
            tasks = self.db_session.exec(query).all()
            
            return [
                {
                    "id": str(task.id),
                    "title": task.title,
                    "description": task.description,
                    "completed": task.completed,
                    "due_date": task.due_date.isoformat() if task.due_date else None,
                    "created_at": task.created_at.isoformat()
                }
                for task in tasks
            ]
        except Exception as e:
            return [{"error": f"Error listing tasks: {str(e)}"}]
    
    def complete_task(self, task_id: str) -> Dict[str, Any]:
        """
        Mark a task as complete
        
        Args:
            task_id: ID of the task to mark as complete
        
        Returns:
            Dictionary with success status and message
        """
        try:
            # Convert string ID to UUID
            task_uuid = uuid.UUID(task_id)
            
            # Find the task
            task = self.db_session.exec(
                select(Task).where(Task.id == task_uuid, Task.user_id == self.user_id)
            ).first()
            
            if not task:
                return {
                    "success": False,
                    "message": f"Task with ID {task_id} not found"
                }
            
            # Update task as completed
            task.completed = True
            task.updated_at = datetime.utcnow()
            
            self.db_session.add(task)
            self.db_session.commit()
            
            return {
                "success": True,
                "message": f"Task '{task.title}' marked as complete"
            }
        except ValueError:
            return {
                "success": False,
                "message": f"Invalid task ID format: {task_id}"
            }
        except Exception as e:
            return {
                "success": False,
                "message": f"Error completing task: {str(e)}"
            }
    
    def delete_task(self, task_id: str) -> Dict[str, Any]:
        """
        Delete a task
        
        Args:
            task_id: ID of the task to delete
        
        Returns:
            Dictionary with success status and message
        """
        try:
            # Convert string ID to UUID
            task_uuid = uuid.UUID(task_id)
            
            # Find the task
            task = self.db_session.exec(
                select(Task).where(Task.id == task_uuid, Task.user_id == self.user_id)
            ).first()
            
            if not task:
                return {
                    "success": False,
                    "message": f"Task with ID {task_id} not found"
                }
            
            # Delete the task
            self.db_session.delete(task)
            self.db_session.commit()
            
            return {
                "success": True,
                "message": f"Task '{task.title}' deleted successfully"
            }
        except ValueError:
            return {
                "success": False,
                "message": f"Invalid task ID format: {task_id}"
            }
        except Exception as e:
            return {
                "success": False,
                "message": f"Error deleting task: {str(e)}"
            }
    
    def update_task(self, task_id: str, title: str = None, description: str = None, 
                    due_date: str = None, completed: bool = None) -> Dict[str, Any]:
        """
        Update a task
        
        Args:
            task_id: ID of the task to update
            title: New title (optional)
            description: New description (optional)
            due_date: New due date (optional)
            completed: New completion status (optional)
        
        Returns:
            Dictionary with success status and message
        """
        try:
            # Convert string ID to UUID
            task_uuid = uuid.UUID(task_id)
            
            # Find the task
            task = self.db_session.exec(
                select(Task).where(Task.id == task_uuid, Task.user_id == self.user_id)
            ).first()
            
            if not task:
                return {
                    "success": False,
                    "message": f"Task with ID {task_id} not found"
                }
            
            # Update task fields if provided
            if title is not None:
                task.title = title
            if description is not None:
                task.description = description
            if due_date is not None:
                parsed_due_date = datetime.fromisoformat(due_date.replace('Z', '+00:00'))
                task.due_date = parsed_due_date
            if completed is not None:
                task.completed = completed
            
            task.updated_at = datetime.utcnow()
            self.db_session.add(task)
            self.db_session.commit()
            
            return {
                "success": True,
                "message": f"Task '{task.title}' updated successfully"
            }
        except ValueError:
            return {
                "success": False,
                "message": f"Invalid task ID or date format"
            }
        except Exception as e:
            return {
                "success": False,
                "message": f"Error updating task: {str(e)}"
            }