/**
 * Core module: global config, auth, http, routing.
 * Do not put feature-specific logic here.
 */

export { appConfig } from './config';
export { AuthProvider, useAuthContext } from './auth';
export type { AuthState, AuthStatus, AuthUser } from './auth';
export { request, get, post, put, del, httpClient } from './http';
export type { HttpError } from './http';
export { AppRouter, ROUTES } from './routing';
export type { RouteId } from './routing';
