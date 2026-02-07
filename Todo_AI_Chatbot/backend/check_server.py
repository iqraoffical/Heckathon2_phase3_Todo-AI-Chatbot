import requests
import time

# Wait a bit for the server to start
time.sleep(10)

try:
    response = requests.get("http://localhost:8000/")
    print("Server is running!")
    print("Response:", response.text)
except Exception as e:
    print(f"Server is not accessible: {e}")