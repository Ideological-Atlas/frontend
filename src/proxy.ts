import createMiddleware from 'next-intl/middleware';
import { NextRequest, NextResponse } from 'next/server';
import { ROUTES_CONFIG, ROLES, DEFAULT_LOGIN_REDIRECT, DEFAULT_AUTH_REDIRECT } from './routes';

const intlMiddleware = createMiddleware({
  locales: ['es', 'en'],
  defaultLocale: 'es',
  localePrefix: 'always',
});

export default function proxy(request: NextRequest) {
  const token = request.cookies.get('access_token')?.value;

  const { pathname } = request.nextUrl;
  const pathnameWithoutLocale = pathname.replace(/^\/(es|en)/, '') || '/';

  const routeRole =
    Object.entries(ROUTES_CONFIG).find(([route]) =>
      route === '/' ? pathnameWithoutLocale === route : pathnameWithoutLocale.startsWith(route),
    )?.[1] ?? ROLES.PUBLIC;

  if (routeRole === ROLES.GUEST && token) {
    const locale = request.nextUrl.pathname.split('/')[1] || 'es';
    return NextResponse.redirect(new URL(`/${locale}${DEFAULT_LOGIN_REDIRECT}`, request.url));
  }

  if (routeRole === ROLES.PROTECTED && !token) {
    const locale = request.nextUrl.pathname.split('/')[1] || 'es';
    return NextResponse.redirect(new URL(`/${locale}${DEFAULT_AUTH_REDIRECT}`, request.url));
  }

  return intlMiddleware(request);
}

export const config = {
  matcher: ['/((?!api|_next|_vercel|.*\\..*).*)'],
};
