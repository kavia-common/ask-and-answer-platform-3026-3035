# API Overview (llm-backend)

- Base URL: http://localhost:8080

## GET /health
Summary: Health check for the service.
Response 200:
{
  "ok": true,
  "status": "healthy",
  "service": { "name": "llm-backend", "version": "0.1.0", "description": "..." },
  "time": "2025-01-01T00:00:00.000Z"
}

## POST /api/chat/ask
Summary: Submit a question to get an answer from the LLM (mocked for now).
Request Body (application/json):
{
  "question": "string"
}

Response 200 (application/json):
{
  "ok": true,
  "answer": "string"
}

Response 400:
{
  "ok": false,
  "error": "Invalid or missing \"question\"."
}

Response 500:
{
  "ok": false,
  "error": "Unknown server error"
}
