import requests
import random

data = {
    "srcip": f"192.168.1.{random.randint(100, 200)}",
    "srcport": random.randint(1024, 65535),
    "dstip": "10.0.0.5",
    "dstport": 80,
    "proto": "TCP",
    "service": "http",
    "duration": 0.5,
    "bytes": 1500,
    "packets": 10
}

try:
    response = requests.post("http://127.0.0.1:8000/api/analyze", json=data)
    print(f"Status: {response.status_code}")
    print(response.json())
except Exception as e:
    print(f"Error: {e}")
