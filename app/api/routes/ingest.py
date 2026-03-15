import os
import shutil
from fastapi import APIRouter, UploadFile, File,HTTPException
from typing import List


from app.core.ingestion.ingest import ingest_file

router = APIRouter()

@router.post("/ingest")
async def ingest(files: List[UploadFile] = File(...)):
    """
    Accepts a PDF/EXCEL file
    Running the ingestion pipeline
    Storing chunks in ChromaDB
    """
    results = []
 
    for file in files:
        temp_path = f"/tmp/{file.filename}"
 
        try:
            with open(temp_path, "wb") as buffer:
                shutil.copyfileobj(file.file, buffer)
 
            result = ingest_file(temp_path)
            results.append({
                "status": "success",
                "doc_id": result["doc_id"],
                "chunks_ingested": result["chunks_ingested"],
            })
 
        except ValueError as e:
            results.append({
                "status": "error",
                "filename": file.filename,
                "detail": str(e),
            })
 
        finally:
            if os.path.exists(temp_path):
                os.remove(temp_path)
 
    return {"ingested": results}