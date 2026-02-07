import { render, screen } from '@testing-library/react';
import { ProfileCard } from '../components/ProfileCard';
import type { UserProfile } from '../types';

const mockProfile: UserProfile = {
  id: '1',
  email: 'jane@example.com',
  displayName: 'Jane Doe',
  createdAt: '2024-01-15T00:00:00.000Z',
};

describe('ProfileCard', () => {
  it('renders profile without avatar (name and email only)', () => {
    render(<ProfileCard profile={mockProfile} />);
    expect(screen.getByText('Name')).toBeInTheDocument();
    expect(screen.getByText('Email')).toBeInTheDocument();
    expect(screen.getByText('Jane Doe')).toBeInTheDocument();
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
    expect(screen.getByText('Jane Doe')).toBeInTheDocument();
  });

  it('renders actions slot when provided', () => {
    render(<ProfileCard profile={mockProfile} actions={<button>Edit</button>} />);
    expect(screen.getByRole('button', { name: 'Edit' })).toBeInTheDocument();
  });

  it('has accessible structure with aria-label', () => {
    render(<ProfileCard profile={mockProfile} />);
    expect(screen.getByRole('article', { name: 'User profile' })).toBeInTheDocument();
  });

});
