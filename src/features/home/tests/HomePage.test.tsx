import { screen } from '@testing-library/react';
import { HomePage } from '../components';
import { renderWithProviders } from '../../../test/utils';

describe('HomePage', () => {
  it('renders default title', () => {
    renderWithProviders(<HomePage />);
    expect(screen.getByRole('heading', { name: /Gresst WebApp/i })).toBeInTheDocument();
  });

  it('renders custom title when provided', () => {
    renderWithProviders(<HomePage title="Custom Title" />);
    expect(screen.getByRole('heading', { name: /Custom Title/i })).toBeInTheDocument();
  });

  it('renders link to profile', () => {
    renderWithProviders(<HomePage />);
    expect(screen.getByRole('link', { name: /Go to Profile/i })).toHaveAttribute('href', '/profile');
  });
});
