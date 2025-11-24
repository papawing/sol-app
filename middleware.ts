import createMiddleware from 'next-intl/middleware';
import { routing } from './i18n/routing';
import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

const intlMiddleware = createMiddleware(routing);

// Simple password protection - ALWAYS ENABLED
const SITE_PASSWORD = '123456';
const PASSWORD_COOKIE = 'site-access';
const ENABLE_PASSWORD = true; // Set to false to disable

export default function middleware(request: NextRequest) {
  // Apply password protection if enabled
  if (ENABLE_PASSWORD) {
    // Allow access to password verification API and static assets
    if (
      request.nextUrl.pathname === '/api/verify-password' ||
      request.nextUrl.pathname.startsWith('/_next') ||
      request.nextUrl.pathname.startsWith('/images') ||
      request.nextUrl.pathname.includes('/password-gate')
    ) {
      return intlMiddleware(request);
    }

    // Check if password cookie exists
    const passwordCookie = request.cookies.get(PASSWORD_COOKIE);

    // Check if user has valid password cookie
    if (!passwordCookie || passwordCookie.value !== SITE_PASSWORD) {
      // Redirect to password page if not authenticated (with locale)
      const url = request.nextUrl.clone();
      url.pathname = '/en/password-gate';
      return NextResponse.redirect(url);
    }
  }

  // Continue with i18n middleware
  return intlMiddleware(request);
}

export const config = {
  // Match only internationalized pathnames
  matcher: ['/', '/(zh|ja|en)/:path*', '/((?!api|_next|_vercel|.*\\..*).*)']
};
