import requests
import json

# Test the server
print("Testing server connection...")

try:
    # Test root endpoint
    response = requests.get("http://localhost:8000/")
    print(f"Root endpoint: {response.status_code} - {response.json()}")

    # Test docs endpoint
    response = requests.get("http://localhost:8000/docs")
    print(f"Docs endpoint: {response.status_code}")

    # Test registering a user
    user_data = {
        "email": "test@example.com",
        "password": "testpassword",
        "name": "Test User"
    }
    
    print("\nTrying to register user...")
    response = requests.post(
        "http://localhost:8000/api/auth/sign-up",
        headers={"Content-Type": "application/json"},
        json=user_data
    )
    
    print(f"Registration response: {response.status_code}")
    if response.status_code != 200:
        print(f"Response text: {response.text}")
        print(f"Response headers: {response.headers}")
    else:
        print(f"Success: {response.json()}")
        
except Exception as e:
    print(f"Error during testing: {e}")