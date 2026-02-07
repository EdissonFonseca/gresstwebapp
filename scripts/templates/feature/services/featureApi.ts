/**
 * __FEATURE_TITLE__ API service. Consumes API via core HTTP client.
 */

import { get } from '@core/http';

const API_ENDPOINT = '/api/__FEATURE_NAME__';

// Define response type in ../types and use it here.
export async function fetch__FEATURE_PASCAL__(): Promise<unknown> {
  return get<unknown>(API_ENDPOINT);
}
