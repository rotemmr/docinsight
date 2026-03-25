# docci
internal searching | RAG-based


## Logic

**Ingestion**
```
upload documents (PDF/EXCEL)  -->  extract text  -->  split into chunks  -->  embedding  -->  store in ChromaDB
```
 
**Query**
```
user question  -->  embed question  -->  search ChromaDB  -->  top chunks + question  -->  GPT-4o-mini  -->  answer
```
 
---

## Getting started

- clone the repo
```bash
git clone https://github.com/rotemmr/docinsight.git
cd docinsight
```

- add your openai key to a `.env` file in the root
```
OPENAI_API_KEY=your_key_here
```

- run
```bash
docker-compose up --build
```

- open http://localhost:8080
