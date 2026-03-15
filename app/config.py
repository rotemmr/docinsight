from dotenv import  load_dotenv
import os

load_dotenv()

OPENAI_API_KEY = os.getenv("OPENAI_API_KEY")
EMBEDDING_MODEL = "text-embedding-3-small"
LLM_MODEL = "gpt-4o-mini"
CHROMA_PATH = "chroma_db"
COLLECTION_NAME = "tenders"
CHUNK_SIZE = 500
CHUNK_OVERLAP = 50

