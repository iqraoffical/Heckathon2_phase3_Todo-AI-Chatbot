import { cookies } from 'next/headers';
import { getSession } from 'better-auth/next-js';

/**
 * Server-side function to get the current user session
 * This function extracts the session cookie and validates it using Better Auth
 */
export async function getCurrentUser() {
  // Get the session cookie
  const cookieStore = await cookies();
  const sessionCookie = cookieStore.get('better-auth-session');

  if (!sessionCookie) {
    return null;
  }

  try {
    // Use Better Auth's server-side session validation
    const session = await getSession({
      headers: new Headers({
        cookie: `${sessionCookie.name}=${sessionCookie.value}`
      })
    });

    if (session) {
      return {
        user: session.user,
        token: session.session.token,
      };
    }

    return null;
  } catch (error) {
    console.error('Error getting current user:', error);
    return null;
  }
}

/**
 * Server-side function to get the JWT token from the session
 */
export async function getServerJwtToken() {
  const user = await getCurrentUser();
  return user?.token || null;
}