import { NextRequest, NextResponse } from "next/server";

export async function middleware(request: NextRequest) {
  try {
    // Check if there's a token in the request cookies
    let token = request.cookies.get('access_token')?.value;

    // If not in cookies, check for token in Authorization header (for API calls)
    if (!token) {
      const authHeader = request.headers.get('authorization');
      if (authHeader && authHeader.startsWith('Bearer ')) {
        token = authHeader.substring(7); // Remove 'Bearer ' prefix
      }
    }

    // For frontend routes, check localStorage via client-side JavaScript would be needed
    // But for server-side middleware, we rely on cookies or headers
    // Define protected routes
    const isProtectedRoute = request.nextUrl.pathname.startsWith('/tasks') ||
                            request.nextUrl.pathname.startsWith('/dashboard') ||
                            request.nextUrl.pathname.startsWith('/chat') ||
                            request.nextUrl.pathname.startsWith('/profile');

    // If user is trying to access a protected route but not authenticated
    if (isProtectedRoute && !token) {
      // Redirect to sign-in page
      const signInUrl = new URL('/signin', request.url);
      signInUrl.searchParams.set('callbackUrl', request.nextUrl.href);
      return NextResponse.redirect(signInUrl);
    }

    // If user is on sign-in or sign-up page but already authenticated, redirect to tasks
    if ((request.nextUrl.pathname.startsWith('/signin') ||
         request.nextUrl.pathname.startsWith('/signup')) &&
        token) {
      const redirectUrl = request.nextUrl.searchParams.get('callbackUrl') || '/tasks';
      return NextResponse.redirect(new URL(redirectUrl, request.url));
    }

    // Allow the request to continue
    return NextResponse.next();
  } catch (error) {
    console.error('Middleware error:', error);
    // On error, allow the request to continue to avoid breaking the app
    return NextResponse.next();
  }
}

// Configure which paths the middleware should run for
export const config = {
  matcher: [
    /*
     * Match all request paths except for the ones starting with:
     * - api (API routes)
     * - _next/static (static files)
     * - _next/image (image optimization files)
     * - favicon.ico (favicon file)
     */
    '/((?!api|_next/static|_next/image|favicon.ico).*)',
  ],
};