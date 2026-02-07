"""
Test script to verify the tags functionality in the API
"""
import json
import requests

BASE_URL = "http://localhost:8000/api"

def test_register_user():
    """Test user registration"""
    url = f"{BASE_URL}/auth/sign-up"
    user_data = {
        "email": "test@example.com",
        "password": "testpassword",
        "name": "Test User"
    }
    
    print("Testing user registration...")
    try:
        response = requests.post(url, json=user_data)
        print(f"Status Code: {response.status_code}")
        print(f"Response: {response.text}")
        
        if response.status_code == 200:
            data = response.json()
            print(f"Access Token: {data.get('access_token', 'N/A')}")
            return data.get('access_token')
        else:
            print("Registration failed!")
            return None
    except Exception as e:
        print(f"Error during registration: {e}")
        return None

def test_create_task_with_tags(token):
    """Test creating a task with tags"""
    if not token:
        print("No token provided, skipping task creation test")
        return
    
    url = f"{BASE_URL}/tasks"
    headers = {
        "Authorization": f"Bearer {token}",
        "Content-Type": "application/json"
    }
    
    task_data = {
        "title": "Test Task with Tags",
        "description": "This is a test task with tags",
        "status": "todo",
        "priority": "high",
        "tags": ["work", "important", "testing"]  # Testing the tags functionality
    }
    
    print("\nTesting task creation with tags...")
    try:
        response = requests.post(url, json=task_data, headers=headers)
        print(f"Status Code: {response.status_code}")
        print(f"Response: {response.text}")
        
        if response.status_code == 200:
            task = response.json()
            print(f"Created Task ID: {task.get('id')}")
            return task.get('id')
        else:
            print("Task creation failed!")
            return None
    except Exception as e:
        print(f"Error during task creation: {e}")
        return None

def test_get_tasks_with_filters(token):
    """Test getting tasks with various filters including tags"""
    if not token:
        print("No token provided, skipping task retrieval test")
        return
    
    # Test with no filters
    url = f"{BASE_URL}/tasks"
    headers = {
        "Authorization": f"Bearer {token}",
        "Content-Type": "application/json"
    }
    
    print("\nTesting task retrieval without filters...")
    try:
        response = requests.get(url, headers=headers)
        print(f"Status Code: {response.status_code}")
        print(f"Number of tasks: {len(response.json()) if response.status_code == 200 else 'Error'}")
    except Exception as e:
        print(f"Error during task retrieval: {e}")
    
    # Test with tags filter
    print("\nTesting task retrieval with tags filter...")
    try:
        params = {"tags": "work"}  # Looking for tasks with 'work' tag
        response = requests.get(url, headers=headers, params=params)
        print(f"Status Code: {response.status_code}")
        print(f"Number of tasks with 'work' tag: {len(response.json()) if response.status_code == 200 else 'Error'}")
    except Exception as e:
        print(f"Error during task retrieval with tags filter: {e}")

if __name__ == "__main__":
    print("Starting API tests for tags functionality...\n")
    
    # Test user registration
    token = test_register_user()
    
    # Test creating a task with tags
    task_id = test_create_task_with_tags(token)
    
    # Test retrieving tasks with filters
    test_get_tasks_with_filters(token)
    
    print("\nAPI tests completed.")