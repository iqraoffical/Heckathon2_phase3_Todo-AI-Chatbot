import pytest
import os
from fastapi.testclient import TestClient
from app.main import app
from app.database import engine
from sqlmodel import SQLModel
from app.models import User
from passlib.context import CryptContext

def test_auth_flow():
    """Test the complete authentication flow"""

    # Create a test client
    client = TestClient(app)

    # Clear the database
    SQLModel.metadata.drop_all(bind=engine)
    SQLModel.metadata.create_all(bind=engine)

    # Test user registration
    user_data = {
        "email": "test@example.com",
        "password": "securepassword123",
        "name": "Test User"
    }

    response = client.post("/api/auth/sign-up", json=user_data)
    assert response.status_code == 200

    data = response.json()
    assert "access_token" in data
    assert data["token_type"] == "bearer"

    token = data["access_token"]

    # Test protected route with valid token
    headers = {"Authorization": f"Bearer {token}"}
    response = client.get("/api/tasks", headers=headers)
    assert response.status_code == 200

    # Test creating a task
    task_data = {
        "title": "Test Task",
        "description": "This is a test task",
        "status": "todo",
        "priority": "medium"
    }

    response = client.post("/api/tasks", json=task_data, headers=headers)
    assert response.status_code == 201

    created_task = response.json()
    assert created_task["title"] == "Test Task"

    # Test getting the task
    task_id = created_task["id"]
    response = client.get(f"/api/tasks/{task_id}", headers=headers)
    assert response.status_code == 200
    assert response.json()["id"] == task_id

    # Test invalid token
    invalid_headers = {"Authorization": "Bearer invalid_token"}
    response = client.get("/api/tasks", headers=invalid_headers)
    assert response.status_code == 401

if __name__ == "__main__":
    test_auth_flow()
    print("Authentication flow test passed!")