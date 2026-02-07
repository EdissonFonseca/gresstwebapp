import { renderHook, waitFor } from '@testing-library/react';
import { describe, it, expect, vi, beforeEach } from 'vitest';
import { use__FEATURE_PASCAL__ } from '../hooks/use__FEATURE_PASCAL__';
import * as api from '../services/featureApi';

vi.mock('../services/featureApi', () => ({
  fetch__FEATURE_PASCAL__: vi.fn(),
}));

describe('use__FEATURE_PASCAL__', () => {
  beforeEach(() => {
    vi.mocked(api.fetch__FEATURE_PASCAL__).mockResolvedValue({});
  });

  it('loads data on mount', async () => {
    const { result } = renderHook(() => use__FEATURE_PASCAL__());
    expect(result.current).toBeDefined();
    await waitFor(() => {
      expect(api.fetch__FEATURE_PASCAL__).toHaveBeenCalled();
    });
  });
});
