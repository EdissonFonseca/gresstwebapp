/**
 * Global application configuration.
 * Environment variables, feature flags, and app-wide constants.
 */

export const appConfig = {
  appName: 'Gresst WebApp',
  isProduction: import.meta.env.PROD,
  baseUrl: import.meta.env.BASE_URL,
} as const;
