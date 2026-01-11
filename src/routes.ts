export const ROLES = {
  PUBLIC: 'public',
  GUEST: 'guest',
  PROTECTED: 'protected',
} as const;

export const ROUTES_CONFIG: Record<string, (typeof ROLES)[keyof typeof ROLES]> = {
  '/login': ROLES.GUEST,
  '/register': ROLES.GUEST,
  '/verify': ROLES.PUBLIC,
  '/': ROLES.PUBLIC,
  '/profile': ROLES.PROTECTED,
};

export const DEFAULT_LOGIN_REDIRECT = '/';
export const DEFAULT_AUTH_REDIRECT = '/login';
