import { NextRequest, NextResponse } from 'next/server';
import { getSessionCookie } from 'better-auth/cookies';

// Define protected routes that require authentication
const protectedRoutes = ['/tasks'];

export async function middleware(request: NextRequest) {
  // Check if the route is protected
  const isProtectedRoute = protectedRoutes.some(route =>
    request.nextUrl.pathname.startsWith(route)
  );

  if (isProtectedRoute) {
    // Use Better Auth's session cookie to check authentication
    const sessionCookie = getSessionCookie(request);

    if (!sessionCookie) {
      // Redirect to signin page if not authenticated
      return NextResponse.redirect(new URL('/signin', request.url));
    }
  }

  // Allow the request to continue
  return NextResponse.next();
}

// Specify which paths the middleware should run for
export const config = {
  matcher: ['/tasks/:path*', '/dashboard/:path*'], // Adjust paths as needed
};