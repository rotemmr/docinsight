import requests
 
response = requests.post(
    "http://localhost:8000/query",
    json={"question": "מה הניסיון המקצועי שלי?"}
)
 
print(response.json())
 