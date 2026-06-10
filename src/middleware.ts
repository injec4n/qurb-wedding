import { NextRequest, NextResponse } from 'next/server';

const ADMIN_COOKIE = 'zafati_admin_auth';

export function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;

  // === Admin page routes ===
  // Protect /admin and all sub-routes EXCEPT /admin/login
  if (pathname.startsWith('/admin') && pathname !== '/admin/login') {
    const adminAuth = request.cookies.get(ADMIN_COOKIE)?.value;
    if (adminAuth !== 'authenticated') {
      return NextResponse.redirect(new URL('/admin/login', request.url));
    }
  }

  // === Client dashboard route ===
  // Protect /client/dashboard (requires client auth cookie)
  if (pathname === '/client/dashboard') {
    const slug = request.nextUrl.searchParams.get('slug');
    if (!slug) {
      return NextResponse.redirect(new URL('/client/login', request.url));
    }
    const clientCookie = request.cookies.get(`zafati_client_${slug}`)?.value;
    if (clientCookie !== 'authenticated') {
      return NextResponse.redirect(new URL('/client/login', request.url));
    }
  }

  // === API routes that require admin auth ===
  // /api/weddings (list/create) - requires admin auth
  if (pathname === '/api/weddings') {
    const adminAuth = request.cookies.get(ADMIN_COOKIE)?.value;
    if (adminAuth !== 'authenticated') {
      return NextResponse.json(
        { success: false, error: 'غير مصرح' },
        { status: 401 }
      );
    }
  }

  // /api/weddings/[id] (but NOT /api/weddings/slug/[slug]) - requires admin auth
  if (pathname.match(/^\/api\/weddings\/[^/]+$/) && !pathname.includes('/slug/')) {
    const adminAuth = request.cookies.get(ADMIN_COOKIE)?.value;
    if (adminAuth !== 'authenticated') {
      return NextResponse.json(
        { success: false, error: 'غير مصرح' },
        { status: 401 }
      );
    }
  }

  // /api/upload - requires admin auth
  if (pathname === '/api/upload') {
    const adminAuth = request.cookies.get(ADMIN_COOKIE)?.value;
    if (adminAuth !== 'authenticated') {
      return NextResponse.json(
        { success: false, error: 'غير مصرح' },
        { status: 401 }
      );
    }
  }

  return NextResponse.next();
}

export const config = {
  matcher: [
    // Admin pages (including sub-routes)
    '/admin/:path*',
    // Client dashboard
    '/client/dashboard',
    // API routes that need protection
    '/api/weddings',
    '/api/weddings/:path*',
    '/api/upload',
  ],
};
