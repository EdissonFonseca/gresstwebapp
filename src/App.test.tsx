import { render, screen } from '@testing-library/react';
import App from './App';

describe('App', () => {
  it('renders the home feature content', () => {
    render(<App />);
    expect(screen.getByText(/Gresst WebApp/i)).toBeInTheDocument();
  });
});
