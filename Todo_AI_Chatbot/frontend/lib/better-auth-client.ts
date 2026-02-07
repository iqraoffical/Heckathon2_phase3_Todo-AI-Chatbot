import { createAuthClient } from 'better-auth/react';
import { jwtClient } from 'better-auth/client/plugins';

// Initialize JWT client plugin to handle JWT tokens
const jwtClientPlugin = jwtClient();

// Initialize Better Auth client with the JWT plugin
const client = createAuthClient({
  baseURL: process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8000', // Update this to your backend URL
  plugins: [jwtClientPlugin],
  fetchOptions: {
    // Add any additional fetch options here
  },
});

// Destructure the methods from the auth client
export const {
  signUp,
  signIn,
  signOut,
  useSession,
  getSession,
  updateUser,
  deleteUser,
  resetPassword,
  forgotPassword,
  verifyEmail,
  socialProviders,
  getClientSession,
  hydrateClientSession
} = client;

// Export JWT client methods
export const { getJwt, useJwt } = jwtClientPlugin;