from openai import OpenAI
from app.config import OPENAI_API_KEY, EMBEDDING_MODEL

client = OpenAI(api_key=OPENAI_API_KEY)

def embed_texts(texts: list[str]) -> list[list[float]]:
    """
    Takes a list of strings and returns a list of embedding vectors.
    Sends in batches of 100 to avoid OpenAI token limits.
    """
    all_embeddings = []
    batch_size = 100

    for i in range(0, len(texts), batch_size):
        batch = texts[i:i + batch_size]
        response = client.embeddings.create(
            model=EMBEDDING_MODEL,
            input=batch,
        )
        all_embeddings.extend([item.embedding for item in response.data])

    return all_embeddings

def embed_query(query: str) -> list[float]:
    """
    Embeds a single query string.
    Returns one vector.
    """
    return embed_texts([query])[0]