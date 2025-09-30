const pad = (n) => String(n).padStart(2, '0');

// PUBLIC_INTERFACE
export function formatDateTimeShort(ts) {
  /** Format a timestamp into a user-friendly short string, e.g., 2025-01-15 14:05 */
  const d = new Date(ts);
  const y = d.getFullYear();
  const m = pad(d.getMonth() + 1);
  const day = pad(d.getDate());
  const hh = pad(d.getHours());
  const mm = pad(d.getMinutes());
  return `${y}-${m}-${day} ${hh}:${mm}`;
}
