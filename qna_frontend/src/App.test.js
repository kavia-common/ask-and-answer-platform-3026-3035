import { render, screen } from '@testing-library/react';
import App from './App';

test('renders Ask & Answer brand title', () => {
  render(<App />);
  const title = screen.getByText(/Ask & Answer/i);
  expect(title).toBeInTheDocument();
});
