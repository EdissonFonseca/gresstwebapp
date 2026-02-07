import { render, screen } from '@testing-library/react';
import { __FEATURE_PASCAL__Page } from '../components/__FEATURE_PASCAL__Page';

describe('__FEATURE_PASCAL__Page', () => {
  it('renders the page heading', () => {
    render(<__FEATURE_PASCAL__Page />);
    expect(screen.getByRole('heading', { name: /__FEATURE_TITLE__/i })).toBeInTheDocument();
  });
});
