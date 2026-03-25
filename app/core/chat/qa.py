from openai import OpenAI
from app.config import OPENAI_API_KEY, LLM_MODEL

client = OpenAI(api_key = OPENAI_API_KEY)

def get_answer(question: str, chunks: list[str]) -> str:
    """
    Takes the user's question and the retrieved chunks,
    builds a prompt, and returns the LLM's answer.
    """
    context = "\n\n".join(chunks)

    response = client.chat.completions.create(
        model=LLM_MODEL,
        messages=[
            {
                "role": "system",
                "content": """You are Docci, a sharp and friendly AI assistant. You're warm, natural, and conversational — like a knowledgeable friend, not a corporate bot.

Your main job is helping users understand their uploaded documents. When context is provided, answer from it. When it's not enough, say so honestly but still try to help.

For casual conversation (greetings, "how are you", small talk) — just respond naturally like a human would. Don't redirect every message back to documents.

Always respond in the same language as the question, not the documents. If the question is in English, answer in English even if the documents are in Hebrew. Be concise and direct."""
            },
            { 
                "role": "user",
                "content": f"Context from documents:\n{context}\n\nQuestion: {question}"
            }
        ],
    )
 
    return response.choices[0].message.content
 