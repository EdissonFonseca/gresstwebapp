import { render, screen } from '@testing-library/react';
import { ProfileCard } from '../components/ProfileCard';
import type { UserProfile } from '../types';

const mockProfile: UserProfile = {
  id: '1',
  firstName: 'Jane',
  lastName: 'Doe',
  email: 'jane@example.com',
  displayName: 'Jane Doe',
  createdAt: '2024-01-15T00:00:00.000Z',
};

describe('ProfileCard', () => {
  it('renders profile without avatar (first name, last name, email)', () => {
    render(<ProfileCard profile={mockProfile} />);
    expect(screen.getByText('First name')).toBeInTheDocument();
    expect(screen.getByText('Last name')).toBeInTheDocument();
    expect(screen.getByText('Email')).toBeInTheDocument();
    expect(screen.getByText('Jane')).toBeInTheDocument();
    expect(screen.getByText('Doe')).toBeInTheDocument();
    expect(screen.getByText('jane@example.com')).toBeInTheDocument();
    expect(screen.getByText('J')).toBeInTheDocument(); // initial in placeholder
  });

  it('renders profile with avatar', () => {
    const { container } = render(
      <ProfileCard profile={{ ...mockProfile, avatarUrl: 'https://example.com/avatar.png' }} />
    );
    const img = container.querySelector('.profile-card__avatar');
    expect(img).toBeInTheDocument();
    expect(img).toHaveAttribute('src', 'https://example.com/avatar.png');
    expect(screen.getByText('Jane')).toBeInTheDocument();
  });

  it('shows Edit button when onSave is provided', () => {
    render(<ProfileCard profile={mockProfile} onSave={async () => {}} />);
    expect(screen.getByRole('button', { name: 'Edit' })).toBeInTheDocument();
  });

  it('renders actions slot when provided', () => {
    render(<ProfileCard profile={mockProfile} onSave={async () => {}} actions={<button>Extra</button>} />);
    expect(screen.getByRole('button', { name: 'Extra' })).toBeInTheDocument();
  });

  it('has accessible structure with aria-label', () => {
    render(<ProfileCard profile={mockProfile} />);
    expect(screen.getByRole('article', { name: 'User profile' })).toBeInTheDocument();
  });

});
