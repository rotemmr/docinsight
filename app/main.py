from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware

from app.api.routes.ingest import router as ingest_router
from app.api.routes.query import router as query_router

app = FastAPI(title="doc-insight")

#Allowing frontend

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_methods=["*"],
    allow_headers=["*"],
)

app.include_router(ingest_router)
app.include_router(query_router)


@app.get("/")
def health_check():
    return {"status": "ok"}

