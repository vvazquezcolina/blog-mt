import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';
import { locales, defaultLocale } from './i18n/config';

export function middleware(request: NextRequest) {
  const pathname = request.nextUrl.pathname;
  
  // Check if there is any supported locale in the pathname
  const pathnameHasLocale = locales.some(
    (locale) => pathname.startsWith(`/${locale}/`) || pathname === `/${locale}`
  );

  // If there's no locale in the pathname, redirect to default locale
  if (!pathnameHasLocale) {
    const locale = defaultLocale;
    
    // Get the pathname without the locale prefix
    const newPathname = pathname === '/' ? `/${locale}` : `/${locale}${pathname}`;
    
    return NextResponse.redirect(
      new URL(newPathname, request.url)
    );
  }
}

export const config = {
  matcher: [
    // Skip all internal paths (_next)
    '/((?!_next|api|favicon.ico|assets).*)',
  ],
};



