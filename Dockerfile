FROM python:3.11-slim

WORKDIR /app

# installing dependencies

COPY requirements.txt .
RUN pip install --no-cache-dir -r requirements.txt

# copying app code

COPY . .

# starting FastAPI exposure

CMD ["uvicorn", "app.main:app", "--host", "0.0.0.0", "--port", "8000", "--reload"]

