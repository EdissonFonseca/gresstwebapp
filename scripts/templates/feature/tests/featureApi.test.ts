import { describe, it, expect, vi, beforeEach } from 'vitest';
import { get } from '@core/http';
import { fetch__FEATURE_PASCAL__ } from '../services/featureApi';

vi.mock('@core/http', () => ({
  get: vi.fn(),
}));

describe('__FEATURE_NAME__ featureApi', () => {
  beforeEach(() => {
    vi.mocked(get).mockReset();
  });

  it('calls the correct endpoint', async () => {
    vi.mocked(get).mockResolvedValue({});
    await fetch__FEATURE_PASCAL__();
    expect(get).toHaveBeenCalledWith('/api/__FEATURE_NAME__');
  });

  it('propagates errors', async () => {
    vi.mocked(get).mockRejectedValue(new Error('Network error'));
    await expect(fetch__FEATURE_PASCAL__()).rejects.toThrow('Network error');
  });
});
