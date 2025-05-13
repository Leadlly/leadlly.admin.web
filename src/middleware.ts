import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

export function middleware(request: NextRequest) {
  const token = request.cookies.get('token')?.value;
  const { pathname } = request.nextUrl;

  // If user is not logged in and trying to access protected routes
  if (!token && !pathname.startsWith('/login') && !pathname.startsWith('/_next') && !pathname.startsWith('/api')) {
    return NextResponse.redirect(new URL('/login', request.url));
  }

  // If user is logged in and trying to access login page
  if (token && pathname === '/login') {
    return NextResponse.redirect(new URL('/select-institute', request.url));
  }

  // If user is logged in and accessing the root path, redirect to institute selection
  if (token && pathname === '/') {
    return NextResponse.redirect(new URL('/select-institute', request.url));
  }

  return NextResponse.next();
}

export const config = {
  matcher: ['/((?!_next/static|_next/image|favicon.ico|assets).*)'],
};