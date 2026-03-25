import chromadb
from app.config import CHROMA_PATH, COLLECTION_NAME

client = chromadb.PersistentClient(path=CHROMA_PATH)
collection = client.get_or_create_collection(name=COLLECTION_NAME)

def add_chunks(chunks: list[str], embeddings: list[list[float]], doc_id: str):
    """
    Stores chunks and their embeddings in ChromaDB.
    Each chunk gets a unique ID based on doc_id and its index.
    """
    ids = [f"{doc_id}_chunk_{i}" for i in range(len(chunks))]
    collection.upsert(
        documents=chunks,
        embeddings=embeddings,
        ids=ids,
    )
 
def clear_collection():
    """
    Deletes and recreates the collection, wiping all stored chunks.
    """
    client.delete_collection(name=COLLECTION_NAME)
    global collection
    collection = client.get_or_create_collection(name=COLLECTION_NAME)

def query_collection(embedding: list[float], n_results: int = 5) -> list[str]:
    """
    Takes a query embedding and returns the top n most similar chunks.
    """
    results = collection.query(
        query_embeddings=[embedding],
        n_results=n_results,
    )
    return results["documents"][0]
 