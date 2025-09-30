# LLM Backend (Node.js/Express)

A minimal Express backend for the Q&A application. It provides:
- Health check endpoint (`GET /health`)
- Scaffold for an LLM proxy route (`POST /api/chat/ask`) to call OpenAI (or other providers) securely with a server-side API key.

## Quick start

1) Install dependencies
   npm install

2) Run locally (development)
   npm run dev

3) Production start
   npm start

Server listens on `PORT` (default 8080).

## Endpoints

- GET /health
  Returns basic service info and status.

- POST /api/chat/ask (scaffold)
  Example request body:
    { "question": "Your question here" }

  Example response (scaffolded/mocked):
    { "answer": "Mock answer" }

Replace the implementation in `src/routes/chat.js` with a real call to OpenAI or another LLM.

## Environment variables

Create a `.env` file in this folder with the following keys:

PORT=8080
CORS_ORIGIN=http://localhost:3000
OPENAI_API_KEY=your-openai-api-key

Notes:
- Do NOT commit secrets. CI/CD should provide production values.
- `CORS_ORIGIN` controls which origin can call this backend.
- `OPENAI_API_KEY` is reserved for future integration.
