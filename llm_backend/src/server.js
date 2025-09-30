import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';

import { healthRouter } from './routes/health.js';
import { chatRouter } from './routes/chat.js';

// Load environment variables from .env if present
dotenv.config();

const app = express();

// Basic app metadata (used in health endpoint)
const APP_META = {
  name: 'llm-backend',
  version: '0.1.0',
  description: 'Express backend for Q&A with LLM proxy scaffold',
};

// CORS configuration
const CORS_ORIGIN = process.env.CORS_ORIGIN || 'http://localhost:3000';
app.use(cors({ origin: CORS_ORIGIN, credentials: true }));

// Body parsers
app.use(express.json({ limit: '1mb' }));
app.use(express.urlencoded({ extended: true }));

// Routes
app.use('/health', healthRouter(APP_META));
app.use('/api/chat', chatRouter());

// Root redirect/help
app.get('/', (_req, res) => {
  res.status(200).json({
    ok: true,
    message: 'llm-backend is running',
    endpoints: {
      health: '/health',
      ask: 'POST /api/chat/ask',
    },
  });
});

// Start server
const PORT = Number(process.env.PORT) || 8080;
app.listen(PORT, () => {
  // eslint-disable-next-line no-console
  console.log(`[llm-backend] Listening on port ${PORT} (CORS origin: ${CORS_ORIGIN})`);
});
