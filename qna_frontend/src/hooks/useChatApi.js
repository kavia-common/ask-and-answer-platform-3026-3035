import { useCallback, useState } from 'react';

// PUBLIC_INTERFACE
export function useChatApi() {
  /**
   * Hook to send a question to a ChatGPT-like API.
   * Currently uses a mock implementation. Replace TODO with real REST call.
   */
  const [isLoading, setIsLoading] = useState(false);
  const [lastAnswer, setLastAnswer] = useState(null);
  const [error, setError] = useState('');

  // PUBLIC_INTERFACE
  const ask = useCallback(async (question, tempId) => {
    setIsLoading(true);
    setError('');
    try {
      // TODO: Replace with actual API call. Example:
      // const res = await fetch(process.env.REACT_APP_API_URL + '/chat/ask', {
      //   method: 'POST',
      //   headers: { 'Content-Type': 'application/json' },
      //   body: JSON.stringify({ question })
      // });
      // if (!res.ok) throw new Error('Failed to fetch answer');
      // const data = await res.json();
      // const answerText = data.answer;

      // Mock handler for demo purposes
      const answerText = await mockAnswer(question);

      const payload = { tempId, answer: answerText };
      setLastAnswer(payload);
      return payload;
    } catch (e) {
      setError(e?.message || 'Unknown error');
      return null;
    } finally {
      setIsLoading(false);
    }
  }, []);

  return { ask, isLoading, error, lastAnswer };
}

async function mockAnswer(question) {
  // very simple mocking to simulate "thinking"
  await delay(700);
  const templates = [
    `Here's a concise answer:\n\n- You asked: "${question}"\n- Key points: clarity, steps, and references.\n\nNext steps:\n1) Validate assumptions\n2) Implement incrementally\n3) Test thoroughly`,
    `Great question! In summary:\n\n"${question}"\n\nConsider:\n- Trade-offs\n- Performance\n- Edge cases\n\nUseful tip: Start with a minimal working solution.`,
    `To approach "${question}", break it down:\n\n1) Define the goal\n2) Identify constraints\n3) Prototype and iterate\n\nThis ensures clarity and reduces risk.`
  ];
  const idx = Math.abs(hash(question)) % templates.length;
  return templates[idx];
}

function delay(ms) {
  return new Promise(res => setTimeout(res, ms));
}

function hash(str) {
  let h = 0, i, chr;
  if (str.length === 0) return h;
  for (i = 0; i < str.length; i++) {
    chr = str.charCodeAt(i);
    // eslint-disable-next-line no-bitwise
    h = ((h << 5) - h) + chr;
    // eslint-disable-next-line no-bitwise
    h |= 0;
  }
  return h;
}
