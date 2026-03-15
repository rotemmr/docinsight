from langchain_text_splitters import RecursiveCharacterTextSplitter
from app.config import CHUNK_SIZE, CHUNK_OVERLAP  

def chunk_text(text: str) -> list[str]:
    """
    Splits raw text into overlapping chunks.
    Returns a list of chunk strings.
    """

    splitter = RecursiveCharacterTextSplitter(
        chunk_size=CHUNK_SIZE, 
        chunk_overlap=CHUNK_OVERLAP
    )
    
    return splitter.split_text(text)
