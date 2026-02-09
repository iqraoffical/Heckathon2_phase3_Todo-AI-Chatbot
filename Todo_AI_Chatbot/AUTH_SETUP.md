# Better Auth Setup Guide

## Environment Variables

Create a `.env.local` file in your project root with the following variables:

```env
# Database Configuration
DATABASE_URL="file:./db.sqlite"

# Better Auth Configuration
AUTH_SECRET="6IZYyqC8Q1jbZPRehXkYqV8aOYFzEQcv"
JWT_SECRET="35fe54d50f8738bd98f64e7f3dc9a1c0d9474a5f3c11cb83b03d2225d5dfe22b"

# Base URL for your application
NEXT_PUBLIC_BASE_URL="http://localhost:3000"
```

## Database Migration

Better Auth handles database migrations automatically. When you run your application for the first time, it will create the necessary tables in your database.

## Common Issues and Solutions

### 1. "Failed to fetch" Error on Login

This usually occurs due to:

- Incorrect `NEXT_PUBLIC_BASE_URL` in environment variables
- CORS issues (ensure your frontend and backend are on the same origin or configure CORS properly)
- Network connectivity issues

**Solution:**
- Verify your `NEXT_PUBLIC_BASE_URL` matches your actual application URL
- If developing locally, ensure it's set to `http://localhost:3000` (or your port)
- Check browser console for specific error messages

### 2. Redirect Issue on Protected Routes

This happens when the session isn't properly detected in middleware. Common causes:

- Missing or incorrect headers in session check
- Cookie not being sent with requests
- JWT token not properly attached

**Solution:**
- Ensure middleware is correctly checking session with `auth.api.getSession({ headers: request.headers })`
- Verify cookies are being set and sent with requests
- Check that JWT plugin is properly configured on both server and client

## Testing the Setup

1. Start your Next.js application:
```bash
npm run dev
```

2. Navigate to `/signin` to test login functionality
3. Navigate to `/tasks` to test protected route access
4. Verify that:
   - Unauthenticated users are redirected to sign-in on protected routes
   - Authenticated users can access protected routes
   - Session persists across page navigations
   - Sign out functionality works properly

## Additional Notes

- The JWT plugin stores tokens in HTTP-only cookies by default for security
- Session validation happens server-side in middleware for protected routes
- Client-side session checks are performed using the auth client
- Remember to change the secrets in production environments