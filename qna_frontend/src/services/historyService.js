const STORAGE_KEY = 'qna_history';

// PUBLIC_INTERFACE
export function loadHistory() {
  /** Load the Q/A history from localStorage (or future backend). */
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (!raw) return [];
    const data = JSON.parse(raw);
    if (!Array.isArray(data)) return [];
    return data;
  } catch {
    return [];
  }
}

// PUBLIC_INTERFACE
export function saveHistoryItem(item) {
  /** Save or update a single history item to local storage (placeholder for backend sync). */
  try {
    const current = loadHistory();
    const idx = current.findIndex(h => h.id === item.id);
    if (idx >= 0) current[idx] = item;
    else current.unshift(item);
    localStorage.setItem(STORAGE_KEY, JSON.stringify(current));
  } catch {
    // ignore
  }
}

// PUBLIC_INTERFACE
export function clearHistory() {
  /** Clear all history locally (placeholder for backend delete). */
  try {
    localStorage.removeItem(STORAGE_KEY);
  } catch {
    // ignore
  }
}
