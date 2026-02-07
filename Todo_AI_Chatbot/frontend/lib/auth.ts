import { betterAuth } from 'better-auth';
import { jwt } from 'better-auth/plugins';

// Initialize Better Auth with JWT plugin
export const auth = betterAuth({
  database: {
    provider: 'sqlite',
    url: process.env.DATABASE_URL || 'file:./dev.db',
  },
  // Enable the JWT plugin to issue JWT tokens
  plugins: [
    jwt({
      secret: process.env.BETTER_AUTH_SECRET || 'your-default-secret-key-change-this',
      expiresIn: '1h', // Short-lived access token
    }),
  ],
  // Configure email/password authentication
  emailAndPassword: {
    enabled: true,
  },
  // Define session configuration
  session: {
    expiresIn: 7 * 24 * 60 * 60, // 7 days
    slidingExpiration: true, // Refresh session on activity
  },
  // User configuration
  user: {
    fields: {
      name: 'name',
      email: 'email',
    },
  },
});

// Export the JWT plugin for client-side usage
export const jwtPlugin = jwt({
  secret: process.env.BETTER_AUTH_SECRET || 'your-default-secret-key-change-this',
  expiresIn: '1h',
});