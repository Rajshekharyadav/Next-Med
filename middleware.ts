import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

// This function can be marked `async` if using `await` inside
export function middleware(request: NextRequest) {
  // For now, we'll just pass through all requests
  // In the future, we can add authentication checks here
  
  // Example: Check if the user is authenticated for protected routes
  // const isAuthenticated = request.cookies.has('auth-token');
  // const isProtectedRoute = request.nextUrl.pathname.startsWith('/dashboard');
  
  // if (isProtectedRoute && !isAuthenticated) {
  //   return NextResponse.redirect(new URL('/login', request.url));
  // }
  
  return NextResponse.next();
}

// See "Matching Paths" below to learn more
export const config = {
  matcher: [
    // Skip all internal paths (_next)
    '/((?!_next/static|_next/image|favicon.ico).*)',
  ],
}; 