from openai import OpenAI
from app.config import OPENAI_API_KEY, LLM_MODEL

client = OpenAI(api_key = OPENAI_API_KEY)

def get_answer(question: str, chunks: list[str]) -> str:
    """
    Takes the user's question and the retrieved chunks,
    builds a prompt, and returns the LLM's answer.
    """
    context = "\n\n".join(chunks)
 
    prompt = f"""You are an expert document analysis assistant. You are helpful, friendly, and can understand questions phrased in any way — formal, casual, or informal.

    Your job is to answer questions based strictly on the context provided below.
    - If the question is about what you can do or who you are, introduce yourself as Docci and explain you answer questions about uploaded documents.
    - Always answer in the same language as the question (Hebrew or English).
    - Understand casual or informal phrasing — for example "yo what's this about" or "מה הסיפור פה" should be treated as "what is this document about".
    - Refer to the document's author or subject in third person.
    - Be precise and concise. Do not make up information.
    - Only if the answer truly cannot be found anywhere in the context, respond with: "I could not find relevant information in the documents."
    - When in doubt, try your best to give a partial answer based on what IS in the context rather than saying nothing.
    - If the question is completely unrelated to the documents (like asking for writing help, general knowledge, or anything outside the documents) — still respond helpfully and let the user know you're mainly built for document analysis, but you'll do your best to help.

Context:
{context}
 
Question:
{question}
 
Answer:"""
 
    response = client.chat.completions.create(
        model=LLM_MODEL,
        messages=[
            {"role": "user", "content": prompt}
        ],
    )
 
    return response.choices[0].message.content
 