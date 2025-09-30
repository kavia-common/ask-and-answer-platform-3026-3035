# Q&A Frontend (React) – Ocean Professional

A modern, lightweight React UI for asking questions and viewing ChatGPT-powered answers.

## Features
- Top navigation with branding
- Main workspace with question form and answer panel
- Sidebar list for Q/A history (stored locally for now)
- Ocean Professional theme with primary (#2563EB), secondary (#F59E0B), error (#EF4444)
- Organized codebase: hooks, services, and utils for easy extension
- Placeholder Chat API with a mock response (swap with real backend later)

## Run locally
- `npm start` – development server at http://localhost:3000
- `npm test` – run tests
- `npm run build` – production build

## Project structure
- `src/App.js` – main layout and Q/A logic
- `src/index.css` – theme and component styles (Ocean Professional)
- `src/hooks/useChatApi.js` – hook to call Chat API (mocked)
- `src/services/historyService.js` – local persistence for Q/A history
- `src/utils/dates.js` – small date formatting helper

## Backend integration (TODO)
Replace the mock in `src/hooks/useChatApi.js` with your REST call:
```js
const res = await fetch(process.env.REACT_APP_API_URL + '/chat/ask', {
  method: 'POST',
  headers: { 'Content-Type': 'application/json' },
  body: JSON.stringify({ question }),
});
```

## Environment variables
Create a `.env` file with:
```
REACT_APP_API_URL=https://your-backend.example.com
```
Do not commit secrets. The deployment pipeline should set the production values.

## Notes
- History is stored in `localStorage` under `qna_history`
- The UI is responsive; the sidebar becomes stacked on smaller screens
