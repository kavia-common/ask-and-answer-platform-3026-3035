import express from 'express';

/**
 * Chat routes for asking questions to an LLM.
 * Current implementation returns a mocked response for safety and consistency.
 * Replace the handler in ask() with a real provider integration using OPENAI_API_KEY when needed.
 */

// PUBLIC_INTERFACE
export function chatRouter() {
  /**
   * Router for chat functionality.
   *
   * POST /api/chat/ask
   * Body: { question: string }
   * Response: { answer: string }
   */
  const router = express.Router();

  router.post('/ask', async (req, res) => {
    try {
      const { question } = req.body || {};
      if (!question || typeof question !== 'string' || !question.trim()) {
        return res.status(400).json({ ok: false, error: 'Invalid or missing "question".' });
      }

      // Placeholder: mock answer to avoid calling external services in this step.
      const answer = buildMockAnswer(question.trim());

      return res.status(200).json({ ok: true, answer });
    } catch (err) {
      return res.status(500).json({
        ok: false,
        error: err?.message || 'Unknown server error',
      });
    }
  });

  return router;
}

function buildMockAnswer(question) {
  const prefix = 'Mock response (backend):\n';
  const templates = [
    `${prefix}\nYou asked: "${question}"\n\nOutline:\n- Clarify objectives\n- Consider constraints\n- Propose steps\n\nNext: Iterate with feedback.`,
    `${prefix}\nTopic: "${question}"\n\nConsider trade-offs, performance, and edge cases.\nStart simple, measure, then refine.`,
    `${prefix}\nApproach for "${question}":\n1) Define success\n2) Prototype\n3) Validate\n4) Improve\n\nThis is a structured placeholder answer.`,
  ];
  const idx = Math.abs(simpleHash(question)) % templates.length;
  return templates[idx];
}

function simpleHash(str) {
  let h = 0;
  for (let i = 0; i < str.length; i += 1) {
    h = (h << 5) - h + str.charCodeAt(i);
    h |= 0; // Convert to 32bit integer
  }
  return h;
}
