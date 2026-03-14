from fastapi import FastAPI

app = FastAPI(title="doc-insight")

app.get("/")

def health_check():
    return {"status": "ok"}

