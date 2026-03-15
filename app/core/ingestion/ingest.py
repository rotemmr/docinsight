import os 
from .pdf_loader import load_pdf
from .excel_loader import load_excel
from .chunker import chunk_text
from app.core.search.embedder import embed_texts
from app.core.vectorstore.chroma_client import add_chunks


def ingest_file(file_path: str) -> dict:
    """
    Running the ingestion pipeline for a given file path
    -------------------
    
    pdf -> text -> chunking -> embedding -> vectorstore ->
    """
    
    ext = os.path.splitext(file_path)[-1].lower()

     # 1. load raw text based on file type
    if ext == '.pdf':
        raw_text = load_pdf(file_path)
    elif ext in ['.xls', '.xlsx']:
        raw_text = load_excel(file_path)
    else:
        raise ValueError(f"Unsupported file type: {ext}")
    
    # 2. split into chunks
    chunks = chunk_text(raw_text)

    #3. embed all chunks
    embeddings = embed_texts(chunks)

    #4. add to vectorstore (storing in ChromaDB, using filename as doc_id)
    doc_id = os.path.splitext(os.path.basename(file_path))[0]
    add_chunks(chunks,embeddings, doc_id)

    return {
        "doc_id": doc_id,
        "chunks_ingested": len(chunks),
    }

