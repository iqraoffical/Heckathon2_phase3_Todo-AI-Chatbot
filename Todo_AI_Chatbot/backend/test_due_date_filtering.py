"""
Test script to verify the due date filtering functionality in the API
"""
import json
import requests
from datetime import datetime, timedelta

BASE_URL = "http://localhost:8000/api"

def test_due_date_filtering():
    """Test due date filtering functionality"""
    
    # Register a test user
    print("Registering test user...")
    register_url = f"{BASE_URL}/auth/sign-up"
    user_data = {
        "email": "test_due_date@example.com",
        "password": "testpassword",
        "name": "Test Due Date User"
    }
    
    try:
        response = requests.post(register_url, json=user_data)
        if response.status_code == 200:
            token = response.json().get('access_token')
            print("User registered successfully")
        else:
            print(f"Registration failed: {response.text}")
            return False
    except Exception as e:
        print(f"Error during registration: {e}")
        return False
    
    headers = {
        "Authorization": f"Bearer {token}",
        "Content-Type": "application/json"
    }
    
    # Create some test tasks with different due dates
    print("\nCreating test tasks with different due dates...")
    
    # Task 1: Due today
    today = datetime.now().strftime('%Y-%m-%d')
    task1_data = {
        "title": "Task due today",
        "description": "This task is due today",
        "status": "todo",
        "priority": "medium",
        "due_date": f"{today}T10:00:00"
    }
    
    response = requests.post(f"{BASE_URL}/tasks", json=task1_data, headers=headers)
    if response.status_code == 200:
        task1 = response.json()
        print(f"Created task 1: {task1['title']} (ID: {task1['id']})")
    else:
        print(f"Failed to create task 1: {response.text}")
        return False
    
    # Task 2: Due tomorrow
    tomorrow = (datetime.now() + timedelta(days=1)).strftime('%Y-%m-%d')
    task2_data = {
        "title": "Task due tomorrow",
        "description": "This task is due tomorrow",
        "status": "todo",
        "priority": "high",
        "due_date": f"{tomorrow}T15:00:00"
    }
    
    response = requests.post(f"{BASE_URL}/tasks", json=task2_data, headers=headers)
    if response.status_code == 200:
        task2 = response.json()
        print(f"Created task 2: {task2['title']} (ID: {task2['id']})")
    else:
        print(f"Failed to create task 2: {response.text}")
        return False
    
    # Task 3: Due next week
    next_week = (datetime.now() + timedelta(days=7)).strftime('%Y-%m-%d')
    task3_data = {
        "title": "Task due next week",
        "description": "This task is due next week",
        "status": "todo",
        "priority": "low",
        "due_date": f"{next_week}T09:00:00"
    }
    
    response = requests.post(f"{BASE_URL}/tasks", json=task3_data, headers=headers)
    if response.status_code == 200:
        task3 = response.json()
        print(f"Created task 3: {task3['title']} (ID: {task3['id']})")
    else:
        print(f"Failed to create task 3: {response.text}")
        return False
    
    # Test due date filtering: Get tasks due from today to tomorrow
    print(f"\nTesting due date filtering: getting tasks due from {today} to {tomorrow}...")
    
    try:
        params = {
            "due_date_from": today,
            "due_date_to": tomorrow
        }
        response = requests.get(f"{BASE_URL}/tasks", headers=headers, params=params)
        
        if response.status_code == 200:
            filtered_tasks = response.json()
            print(f"Found {len(filtered_tasks)} tasks due between {today} and {tomorrow}")
            
            for task in filtered_tasks:
                print(f"- {task['title']} (due: {task.get('due_date', 'N/A')})")
                
            # Verify that we got the expected tasks
            titles = [task['title'] for task in filtered_tasks]
            if "Task due today" in titles and "Task due tomorrow" in titles and len(filtered_tasks) == 2:
                print("✓ Due date filtering test passed!")
                return True
            else:
                print("✗ Due date filtering test failed: unexpected results")
                return False
        else:
            print(f"Failed to get filtered tasks: {response.text}")
            return False
    except Exception as e:
        print(f"Error during due date filtering test: {e}")
        return False

if __name__ == "__main__":
    print("Starting due date filtering tests...\n")
    
    success = test_due_date_filtering()
    
    if success:
        print("\n✓ All due date filtering tests passed!")
    else:
        print("\n✗ Some tests failed.")