import requests

try:
    response = requests.get("http://127.0.0.1:8000/api/remediations")
    tasks = response.json()
    
    print(f"Total tasks: {len(tasks)}")
    for task in tasks:
        print(f"ID: {task['id']}, Status: {task['status']}, Time: {task['startTime']}")

except Exception as e:
    print(f"Error: {e}")
