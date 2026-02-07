import { render, screen } from '@testing-library/react';
import { HomePage } from '../components';

describe('HomePage', () => {
  it('renders default title', () => {
    render(<HomePage />);
    expect(screen.getByRole('heading', { name: /Gresst WebApp/i })).toBeInTheDocument();
  });

  it('renders custom title when provided', () => {
    render(<HomePage title="Custom Title" />);
    expect(screen.getByRole('heading', { name: /Custom Title/i })).toBeInTheDocument();
  });
});
