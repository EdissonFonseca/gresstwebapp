import { render, screen } from '@testing-library/react';
import { ProfileField } from '../components/ProfileField';

describe('ProfileField', () => {
  it('renders label and value', () => {
    render(<ProfileField label="Email" value="user@example.com" />);
    expect(screen.getByText('Email')).toBeInTheDocument();
    expect(screen.getByText('user@example.com')).toBeInTheDocument();
  });

  it('renders React node as value', () => {
    render(<ProfileField label="Name" value={<strong>John</strong>} />);
    expect(screen.getByText('Name')).toBeInTheDocument();
    expect(screen.getByText('John').tagName).toBe('STRONG');
  });
});
