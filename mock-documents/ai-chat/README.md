# AI Chat Mock Documents

These temporary files are used to test AI Chat retrieval.

When the Java backend starts, it reads these files and seeds matching rows into:

- `DOCUMENT`
- `AI_SUMMARY`

The Python service does not read or write the database. Java reads these mock documents, stores the summaries, and sends selected context to Python.
