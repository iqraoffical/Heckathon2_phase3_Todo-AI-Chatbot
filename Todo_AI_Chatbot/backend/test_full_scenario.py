import asyncio
import json
from datetime import datetime, timedelta
import requests

# Configuration
BASE_URL = "http://localhost:8000/api"

def test_full_scenario():
    print("Starting full test scenario...")
    
    # Step 1: User1 signs up and creates 3 tasks
    print("\n1. Creating User1...")
    user1_data = {
        "email": "user1@example.com",
        "password": "password123",
        "name": "User One"
    }
    response = requests.post(f"{BASE_URL}/auth/sign-up", json=user1_data)
    assert response.status_code == 200, f"Sign up failed: {response.text}"
    user1_token = response.json()["access_token"]
    print(f"User1 signed up successfully. Token: {user1_token[:10]}...")
    
    # Create 3 tasks for User1 with different properties
    print("\nCreating 3 tasks for User1...")
    headers = {"Authorization": f"Bearer {user1_token}"}
    
    # Task 1: High priority, with tags, due date
    task1 = {
        "title": "High Priority Task",
        "description": "This is a high priority task",
        "status": "todo",
        "priority": "high",
        "due_date": (datetime.now() + timedelta(days=1)).isoformat(),
        "tags": json.dumps(["important", "work"])
    }
    response = requests.post(f"{BASE_URL}/tasks", json=task1, headers=headers)
    assert response.status_code == 201, f"Task 1 creation failed: {response.text}"
    task1_id = response.json()["id"]
    print(f"Task 1 created: {task1_id}")
    
    # Task 2: Medium priority, different tags
    task2 = {
        "title": "Medium Priority Task",
        "description": "This is a medium priority task",
        "status": "todo",
        "priority": "medium",
        "due_date": (datetime.now() + timedelta(days=3)).isoformat(),
        "tags": json.dumps(["personal", "follow-up"])
    }
    response = requests.post(f"{BASE_URL}/tasks", json=task2, headers=headers)
    assert response.status_code == 201, f"Task 2 creation failed: {response.text}"
    task2_id = response.json()["id"]
    print(f"Task 2 created: {task2_id}")
    
    # Task 3: Low priority, different tags
    task3 = {
        "title": "Low Priority Task",
        "description": "This is a low priority task",
        "status": "todo",
        "priority": "low",
        "due_date": (datetime.now() + timedelta(days=5)).isoformat(),
        "tags": json.dumps(["later", "maybe"])
    }
    response = requests.post(f"{BASE_URL}/tasks", json=task3, headers=headers)
    assert response.status_code == 201, f"Task 3 creation failed: {response.text}"
    task3_id = response.json()["id"]
    print(f"Task 3 created: {task3_id}")
    
    # Verify User1 has 3 tasks
    response = requests.get(f"{BASE_URL}/tasks", headers=headers)
    assert response.status_code == 200, f"Get tasks failed: {response.text}"
    user1_tasks = response.json()
    assert len(user1_tasks) == 3, f"Expected 3 tasks for User1, got {len(user1_tasks)}"
    print(f"User1 has {len(user1_tasks)} tasks as expected")
    
    # Step 2: User2 signs up and should see 0 tasks
    print("\n2. Creating User2...")
    user2_data = {
        "email": "user2@example.com",
        "password": "password123",
        "name": "User Two"
    }
    response = requests.post(f"{BASE_URL}/auth/sign-up", json=user2_data)
    assert response.status_code == 200, f"User2 sign up failed: {response.text}"
    user2_token = response.json()["access_token"]
    print(f"User2 signed up successfully. Token: {user2_token[:10]}...")
    
    # Verify User2 has 0 tasks initially
    headers2 = {"Authorization": f"Bearer {user2_token}"}
    response = requests.get(f"{BASE_URL}/tasks", headers=headers2)
    assert response.status_code == 200, f"Get tasks for User2 failed: {response.text}"
    user2_tasks = response.json()
    assert len(user2_tasks) == 0, f"Expected 0 tasks for User2, got {len(user2_tasks)}"
    print(f"User2 has {len(user2_tasks)} tasks as expected (no data leakage)")
    
    # Step 3: User1 logs in and tests search, filter, sort
    print("\n3. Testing User1's search, filter, and sort functionality...")
    
    # Test search by title
    params = {"search": "High Priority"}
    response = requests.get(f"{BASE_URL}/tasks", headers=headers, params=params)
    assert response.status_code == 200, f"Search failed: {response.text}"
    search_results = response.json()
    assert len(search_results) == 1, f"Expected 1 search result, got {len(search_results)}"
    print(f"Search test passed: Found {len(search_results)} task matching 'High Priority'")
    
    # Test filter by priority (high)
    params = {"priority": "high"}
    response = requests.get(f"{BASE_URL}/tasks", headers=headers, params=params)
    assert response.status_code == 200, f"Filter by priority failed: {response.text}"
    priority_results = response.json()
    assert len(priority_results) == 1, f"Expected 1 high priority task, got {len(priority_results)}"
    print(f"Filter by priority test passed: Found {len(priority_results)} high priority task")
    
    # Test sort by due date (ascending)
    params = {"sort_by": "due_date", "order": "asc"}
    response = requests.get(f"{BASE_URL}/tasks", headers=headers, params=params)
    assert response.status_code == 200, f"Sort by due date failed: {response.text}"
    sorted_tasks = response.json()
    assert len(sorted_tasks) == 3, f"Expected 3 sorted tasks, got {len(sorted_tasks)}"
    # Verify the order is correct (earliest due date first)
    for i in range(len(sorted_tasks) - 1):
        current_due = sorted_tasks[i]["due_date"]
        next_due = sorted_tasks[i + 1]["due_date"]
        assert current_due <= next_due, f"Tasks not sorted correctly by due date"
    print(f"Sort by due date test passed: Tasks are properly ordered")
    
    # Step 4: Test toggle complete, edit, delete
    print("\n4. Testing toggle complete, edit, and delete...")
    
    # Toggle task completion (PATCH /tasks/{id}/complete)
    response = requests.patch(f"{BASE_URL}/tasks/{task1_id}/complete", headers=headers)
    assert response.status_code == 200, f"Toggle complete failed: {response.text}"
    updated_task = response.json()
    assert updated_task["status"] == "completed", f"Task status not updated to completed"
    print(f"Toggle complete test passed: Task {task1_id} marked as completed")
    
    # Edit task (PUT /tasks/{id})
    updated_task_data = {
        "title": "Updated High Priority Task",
        "description": "This task has been updated",
        "status": "in_progress",
        "priority": "high",
        "due_date": (datetime.now() + timedelta(days=2)).isoformat(),
        "tags": json.dumps(["important", "work", "updated"])
    }
    response = requests.put(f"{BASE_URL}/tasks/{task1_id}", json=updated_task_data, headers=headers)
    assert response.status_code == 200, f"Edit task failed: {response.text}"
    edited_task = response.json()
    assert edited_task["title"] == "Updated High Priority Task", f"Task title not updated"
    assert edited_task["status"] == "in_progress", f"Task status not updated during edit"
    print(f"Edit task test passed: Task {task1_id} updated successfully")
    
    # Delete task (DELETE /tasks/{id})
    response = requests.delete(f"{BASE_URL}/tasks/{task2_id}", headers=headers)
    assert response.status_code == 200, f"Delete task failed: {response.text}"
    print(f"Delete task test passed: Task {task2_id} deleted successfully")
    
    # Verify deletion worked
    response = requests.get(f"{BASE_URL}/tasks/{task2_id}", headers=headers)
    assert response.status_code == 404, f"Task should be deleted but still accessible"
    print(f"Deletion verification passed: Task {task2_id} is no longer accessible")
    
    # Final verification: User1 should now have 2 tasks (1 completed, 1 deleted)
    response = requests.get(f"{BASE_URL}/tasks", headers=headers)
    assert response.status_code == 200, f"Final verification failed: {response.text}"
    final_user1_tasks = response.json()
    assert len(final_user1_tasks) == 2, f"Expected 2 tasks for User1 after deletion, got {len(final_user1_tasks)}"
    print(f"Final verification passed: User1 has {len(final_user1_tasks)} tasks remaining")
    
    # Verify User2 still has 0 tasks (data isolation)
    response = requests.get(f"{BASE_URL}/tasks", headers=headers2)
    assert response.status_code == 200, f"User2 data isolation check failed: {response.text}"
    final_user2_tasks = response.json()
    assert len(final_user2_tasks) == 0, f"User2 should still have 0 tasks, got {len(final_user2_tasks)}"
    print(f"Data isolation verified: User2 still has {len(final_user2_tasks)} tasks")
    
    print("\n🎉 All tests passed! The implementation is working correctly.")
    print("- Users can sign up and create tasks")
    print("- Data isolation between users is maintained")
    print("- Search, filter, and sort functionality works")
    print("- Complete, edit, and delete operations work properly")

if __name__ == "__main__":
    test_full_scenario()