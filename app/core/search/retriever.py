from app.core.search.embedder import embed_query
from app.core.vectorstore.chroma_client import query_collection

def retrieve(query: str, n_results: int = 5) -> list[str]:
    """
    Takes a user question, embeds it, and returns the top n
    most similar chunks from ChromaDB
    """

    query_embedding = embed_query(query)
    chunks = query_collection(query_embedding, n_results=n_results)
    return chunks

