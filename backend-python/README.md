# AI Study Hub Python Backend

FastAPI service for AI generation workflows. This service receives document context from Spring Boot, prepares prompts, calls the configured LLM provider, and returns AI results to the Java backend.

## Responsibility Boundary

Python is AI-only. It must not read from or write to SQL Server.

Spring Boot Java owns all database work:

1. Java receives the frontend request.
2. Java reads documents, summaries, chat sessions, and messages from SQL Server.
3. Java sends only the selected context to Python for AI generation.
4. Python returns the generated summary or answer.
5. Java saves summaries, chat sessions, and chat messages into SQL Server.

## Structure

```text
backend-python/
  README.md
  requirements.txt
  .env
  .env.example
  config.yaml
  main.py
  src/
    api/
    chunking/
    core/
    embeddings/
    ingestion/
    llm/
    prompts/
    schemas/
    utils/
    vectordb/
  tests/
  logs/
```

## Run

```powershell
cd C:\Users\admin\Downloads\AI_Study_Hub_v.1.0\backend-python
.\.venv\Scripts\Activate.ps1
python -m uvicorn main:app --reload --port 8000
```

Swagger: http://localhost:8000/docs

## Document Summarization

Endpoint:

```text
POST /api/documents/summarize
```

The endpoint accepts either raw `text` or a local `file_path` for basic `.txt`, `.md`, and `.csv` files. It returns a generated summary only. The Java backend persists that summary to SQL Server through its repository layer.
