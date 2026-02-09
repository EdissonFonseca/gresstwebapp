/**
 * Central route definitions. Each route path should map to a feature.
 */

export const ROUTES = {
  home: '/',
  login: '/login',
  userProfile: '/profile',
  changePassword: '/cambiar-contrasena',
  notFound: '/404',
} as const;

export type RouteId = keyof typeof ROUTES;
