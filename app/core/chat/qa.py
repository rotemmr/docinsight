from openai import OpenAI
from app.config import OPEN_API_KEY, LLM_MODEL

client = OpenAI(api_key = OPEN_API_KEY)

def get_answer(question: str, chunks: list[str]) -> str:
    """
    Takes the user's question and the retrieved chunks,
    builds a prompt, and returns the LLM's answer.
    """
    context = "\n\n".join(chunks)
 
    prompt = f"""אתה עוזר מומחה לניתוח מכרזים.
השתמש אך ורק במידע המופיע בהקשר הבא כדי לענות על השאלה.
אם התשובה לא נמצאת בהקשר, אמור "לא מצאתי מידע רלוונטי במסמכים".
 
הקשר:
{context}
 
שאלה:
{question}
 
תשובה:"""
 
    response = client.chat.completions.create(
        model=LLM_MODEL,
        messages=[
            {"role": "user", "content": prompt}
        ],
    )
 
    return response.choices[0].message.content
 