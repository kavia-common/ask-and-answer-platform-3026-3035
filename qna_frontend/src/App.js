import React, { useEffect, useMemo, useState } from 'react';
import './index.css';
import { useChatApi } from './hooks/useChatApi';
import { saveHistoryItem, loadHistory, clearHistory } from './services/historyService';
import { formatDateTimeShort } from './utils/dates';

// PUBLIC_INTERFACE
function App() {
  /**
   * Main App component rendering top navbar, sidebar history, and main Q/A workspace.
   * Integrates a ChatGPT-like API via the useChatApi hook and persists local history to localStorage.
   */
  const [question, setQuestion] = useState('');
  const [history, setHistory] = useState(() => loadHistory());
  const [selectedId, setSelectedId] = useState(null);
  // Track the active in-flight question by its temporary id to avoid answer misattribution
  const [activeTempId, setActiveTempId] = useState(null);
  const { ask, isLoading, error, lastAnswer } = useChatApi();

  // derive the selected history item
  const selectedItem = useMemo(() => {
    if (!selectedId) return null;
    return history.find(h => h.id === selectedId) || null;
  }, [selectedId, history]);

  useEffect(() => {
    // if we just received an answer from ask(), sync to selected and history
    if (lastAnswer && lastAnswer.tempId) {
      const updated = history.map(h =>
        h.id === lastAnswer.tempId ? { ...h, answer: lastAnswer.answer, updatedAt: Date.now() } : h
      );
      setHistory(updated);
      persistHistory(updated);
      // Clear active when the specific tempId completes
      if (activeTempId === lastAnswer.tempId) {
        setActiveTempId(null);
      }
    }
  }, [lastAnswer]); // eslint-disable-line react-hooks/exhaustive-deps

  const persistHistory = (items) => {
    // save to local storage and optionally to backend in the future
    // TODO: integrate REST API for persistent storage
    localStorage.setItem('qna_history', JSON.stringify(items));
  };

  const onSubmit = async (e) => {
    e.preventDefault();
    const trimmed = question.trim();
    if (!trimmed) return;

    // optimistic item with temp id
    const tempId = `local-${Date.now()}`;
    const newItem = {
      id: tempId,
      question: trimmed,
      answer: '',
      createdAt: Date.now(),
      updatedAt: Date.now(),
    };
    const nextHistory = [newItem, ...history];
    setHistory(nextHistory);
    setSelectedId(tempId);
    setActiveTempId(tempId);
    persistHistory(nextHistory);
    saveHistoryItem(newItem); // service hook for future backend

    // call chat api
    const res = await ask(trimmed, tempId);
    // If ask failed (res null), clear activeTempId to avoid stale loading state
    if (!res) {
      setActiveTempId(null);
    }
    setQuestion('');
  };

  const onSelectHistory = (id) => {
    // Prevent switching context while generating an answer for a specific item
    if (isLoading && activeTempId && id !== activeTempId) return;
    setSelectedId(id);
  };

  const onClearHistory = () => {
    if (!window.confirm('Clear all Q/A history?')) return;
    clearHistory();
    setHistory([]);
    setSelectedId(null);
  };

  // Only use lastAnswer for display if it belongs to the selected item and is the active one (during loading) or completed for that item
  const displayedAnswer = (() => {
    if (!selectedItem) return '';
    // Prefer the stored answer in history if available
    if (selectedItem.answer) return selectedItem.answer;
    // During loading, show lastAnswer only if it matches the selected item and is currently active
    if (isLoading && activeTempId && selectedItem.id === activeTempId && lastAnswer?.tempId === activeTempId) {
      return lastAnswer.answer || '';
    }
    // After loading, if lastAnswer corresponds to this item, allow display as fallback
    if (!isLoading && lastAnswer?.tempId === selectedItem.id) {
      return lastAnswer.answer || '';
    }
    return '';
  })();

  return (
    <div className="app">
      <TopNav />

      <div className="layout">
        <aside className="sidebar">
          <div className="card">
            <div className="sidebar-header">
              <div>
                <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                  <span className="badge">History</span>
                </div>
                <div className="helper" style={{ marginTop: 6 }}>Your recent Q/As</div>
              </div>
              <button className="btn secondary" onClick={onClearHistory} title="Clear history">
                🧹 Clear
              </button>
            </div>
            <div className="history-list">
              {history.length === 0 && (
                <div className="helper" style={{ padding: 12 }}>
                  No history yet. Ask your first question!
                </div>
              )}
              {history.map(item => {
                const disabled = isLoading && activeTempId && item.id !== activeTempId;
                return (
                  <button
                    key={item.id}
                    className="history-item"
                    onClick={() => onSelectHistory(item.id)}
                    aria-label={`Open Q/A from ${formatDateTimeShort(item.createdAt)}`}
                    disabled={disabled}
                    title={disabled ? 'Please wait for the current answer to finish.' : undefined}
                  >
                    <div className="history-title">{truncate(item.question, 90)}</div>
                    <div className="history-sub">
                      {formatDateTimeShort(item.createdAt)}
                    </div>
                  </button>
                );
              })}
            </div>
          </div>
        </aside>

        <main className="main">
          <div className="card">
            <div className="section-title">
              <div className="brand-mark">Q</div>
              <div>
                <div className="brand-title">Ask a question</div>
                <div className="brand-sub">Powered by ChatGPT (placeholder integration)</div>
              </div>
            </div>

            <form onSubmit={onSubmit} className="question-form">
              <label htmlFor="question" className="helper">Your question</label>
              <textarea
                id="question"
                rows="4"
                className="input"
                placeholder="Type your question here..."
                value={question}
                onChange={(e) => setQuestion(e.target.value)}
              />
              <div className="actions">
                <div className="helper">
                  Tip: Be specific. You can paste code snippets or include context.
                </div>
                <div style={{ display: 'flex', gap: 10 }}>
                  <button type="submit" className="btn" disabled={isLoading}>
                    {isLoading ? 'Thinking…' : 'Ask'}
                  </button>
                  <button
                    type="button"
                    className="btn secondary"
                    onClick={() => setQuestion('')}
                    disabled={isLoading || !question}
                  >
                    Reset
                  </button>
                </div>
              </div>
            </form>

            <hr className="sep" />

            <div className="answer-panel">
              <div className="answer-title">
                <span className="badge">Answer</span>
                {isLoading && activeTempId && (
                  <span className="helper">Generating response for selected question…</span>
                )}
              </div>
              <div className="helper" style={{ marginTop: 6 }}>
                Note: This is a placeholder integration. Answers are mock-generated for demo consistency.
              </div>
              <div className="answer-content">
                {error && <span style={{ color: 'var(--error)' }}>Error: {error}</span>}
                {!error && (displayedAnswer ? displayedAnswer : <span className="helper">Your answer will appear here.</span>)}
              </div>
            </div>
          </div>
        </main>
      </div>
    </div>
  );
}

// PUBLIC_INTERFACE
function TopNav() {
  /** Top navigation bar with branding and actions (theme placeholder, settings placeholder). */
  return (
    <nav className="navbar">
      <div className="navbar-inner">
        <div className="brand">
          <div className="brand-mark">A</div>
          <div>
            <div className="brand-title">Ask & Answer</div>
            <div className="brand-sub">Ocean Professional</div>
          </div>
        </div>
        <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
          <span className="badge" title="Design theme name">Ocean</span>
          <button className="btn secondary" type="button" onClick={() => alert('TODO: Settings')}>
            ⚙️ Settings
          </button>
        </div>
      </div>
    </nav>
  );
}

function truncate(text, n) {
  if (!text) return '';
  return text.length > n ? text.slice(0, n - 1) + '…' : text;
}

export default App;
