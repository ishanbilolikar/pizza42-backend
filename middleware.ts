import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

// Middleware for Auth0 session management
export function middleware(request: NextRequest) {
  // Pass through - Auth0 handles sessions via cookies
  return NextResponse.next();
}

export const config = {
  matcher: [
    '/((?!_next/static|_next/image|favicon.ico).*)',
  ],
};
