from openai import OpenAI
from app.config import OPEN_API_KEY, EMBEDDING_MODEL

client = OpenAI(api_key=OPEN_API_KEY)

def embed_texts(texts: list[str]) -> list[list[float]]:
    """
    Takes a list of strings and returns a list of embedding vectors.
    Used during ingestion and at query time.
    """
    response = client.embeddings.create(
        model=EMBEDDING_MODEL,
        input=texts,
    )
    
    return [item.embedding for item in response.data]





def embed_query(query: str) -> list[float]:
     """
    Embeds a single query string.
    Returns one vector.
    """
     
     return embed_texts([query])[0]