import { screen } from '@testing-library/react';
import { HomePage } from '../components';
import { renderWithProviders } from '../../../test/utils';

describe('HomePage', () => {
  it('renders default title when user has no display name', () => {
    renderWithProviders(<HomePage />);
    expect(screen.getByRole('heading', { name: /^Gresst$/i })).toBeInTheDocument();
  });

  it('renders custom title when provided and no user', () => {
    renderWithProviders(<HomePage title="Custom Title" />);
    expect(screen.getByRole('heading', { name: /Custom Title/i })).toBeInTheDocument();
  });

  it('renders shortcut to profile', () => {
    renderWithProviders(<HomePage />);
    const profileLink = screen.getByRole('link', { name: /Mi perfil/i });
    expect(profileLink).toHaveAttribute('href', '/profile');
  });

  it('renders shortcuts section and quick access cards', () => {
    renderWithProviders(<HomePage />);
    expect(screen.getByRole('heading', { name: /Accesos rápidos/i })).toBeInTheDocument();
    expect(screen.getByRole('link', { name: /Solicitudes/i })).toBeInTheDocument();
    expect(screen.getByRole('link', { name: /Reportes/i })).toBeInTheDocument();
  });
});
