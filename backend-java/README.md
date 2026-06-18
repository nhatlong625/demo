# AI Study Hub Java Backend

Spring Boot service for business data, SQL Server persistence, and management APIs.

## Responsibility Boundary

Java owns all SQL Server work:

- Reads document summaries from `AI_SUMMARY`, `DOCUMENT`, and `SUBJECT`.
- Saves chat sessions and chat messages.
- Saves generated document summaries.
- Sends only selected AI context to the Python service.

Python owns only AI generation and must not read from or write to SQL Server.

## Run With Local DB Config

Edit `backend-java\.env`:

```properties
DB_HOST=localhost
DB_PORT=1433
DB_NAME=AI_StudyHub
DB_USERNAME=sa
DB_PASSWORD=your_sql_password
SERVER_PORT=8080
PYTHON_AI_BASE_URL=http://localhost:8000
```

Then run:

```powershell
cd C:\Users\admin\Downloads\AI_Study_Hub_v.1.0\backend-java
.\run-java.ps1
```
