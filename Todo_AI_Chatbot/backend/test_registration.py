import requests
import json

BASE_URL = "http://localhost:8000/api"

def test_registration():
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
        import traceback
        traceback.print_exc()
        return None

if __name__ == "__main__":
    test_registration()