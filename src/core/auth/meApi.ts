/**
 * GET /api/me — current session (profile, account, person, roles).
 * Used when app loads with existing token (e.g. external redirect or refresh) to get user and account names.
 */

import { get } from '@core/http';

export interface MeProfile {
  id: string;
  accountId: string;
  firstName: string;
  lastName: string;
  name: string;
  email: string;
  status: string;
  isActive: boolean;
  personId?: string;
  lastAccess: string | null;
  createdAt: string;
}

export interface MeAccount {
  id: string;
  name: string;
  role: string;
  status: string;
  personId: string;
  isActive: boolean;
}

export interface MePerson {
  id: string;
  name: string;
  documentNumber?: string;
  email?: string;
  phone?: string;
  address?: string | null;
}

export interface MeResponse {
  profile: MeProfile;
  account: MeAccount;
  person: MePerson;
  roles: string[];
}

const ME_ENDPOINT = '/api/me';

export async function fetchMe(): Promise<MeResponse> {
  return get<MeResponse>(ME_ENDPOINT);
}
