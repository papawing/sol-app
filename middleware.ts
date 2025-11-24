import createMiddleware from 'next-intl/middleware';
import { routing } from './i18n/routing';
import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

const intlMiddleware = createMiddleware(routing);

// Simple password protection (only enable in production)
const SITE_PASSWORD = '123456';
const PASSWORD_COOKIE = 'site-access';

export default function middleware(request: NextRequest) {
  // Only apply password protection in production
  if (process.env.NODE_ENV === 'production' && process.env.ENABLE_PASSWORD_PROTECTION === 'true') {
    // Check if password cookie exists
    const passwordCookie = request.cookies.get(PASSWORD_COOKIE);

    // Allow access to password verification API
    if (request.nextUrl.pathname === '/api/verify-password') {
      return NextResponse.next();
    }

    // Check if user has valid password cookie
    if (!passwordCookie || passwordCookie.value !== SITE_PASSWORD) {
      // Redirect to password page if not authenticated
      if (!request.nextUrl.pathname.startsWith('/password-gate')) {
        const url = request.nextUrl.clone();
        url.pathname = '/password-gate';
        return NextResponse.redirect(url);
      }
    }
  }

  // Continue with i18n middleware
  return intlMiddleware(request);
}

export const config = {
  // Match only internationalized pathnames
  matcher: ['/', '/(zh|ja|en)/:path*', '/((?!api|_next|_vercel|.*\\..*).*)']
};
