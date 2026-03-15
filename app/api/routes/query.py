from fastapi import APIRouter, HTTPException
from pydantic import BaseModel
 
from app.core.search.retriever import retrieve
from app.core.chat.qa import get_answer

router = APIRouter()

class QueryRequest(BaseModel):
    question: str
    n_results: int = 5

@router.post("/query")
async def query(request: QueryRequest):
    """
    Accepts a question as input
    Retrieves relevant chunks from ChromaDB
    Returns an llm-generated answer
    """

    if not request.question.strip():
        raise HTTPException(status_code=400, detail="Question cannot be empty.")
    
    chunks = retrieve(request.question, request.n_results)
    answer = get_answer(request.question, chunks)

    return {
        "question": request.question,
        "answer": answer,
        "retrieved_chunks": len(chunks),
    }