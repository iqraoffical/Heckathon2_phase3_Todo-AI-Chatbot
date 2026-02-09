// lib/auth.ts
import { User } from './types';

// Check if user is authenticated
export const isAuthenticated = (): boolean => {
  const token = localStorage.getItem('auth_token');
  // In a real app, you might want to decode and validate the JWT
  return !!token;
};

// Get current user from token
export const getCurrentUser = (): User | null => {
  const token = localStorage.getItem('auth_token');
  if (!token) return null;

  try {
    // Decode JWT token to get user info
    const base64Url = token.split('.')[1];
    const base64 = base64Url.replace(/-/g, '+').replace(/_/g, '/');
    const jsonPayload = decodeURIComponent(
      atob(base64)
        .split('')
        .map((c) => '%' + ('00' + c.charCodeAt(0).toString(16)).slice(-2))
        .join('')
    );

    return JSON.parse(jsonPayload);
  } catch (error) {
    console.error('Error decoding token:', error);
    return null;
  }
};

// Login function
export const login = async (email: string, password: string): Promise<{ user: User; token: string } | null> => {
  try {
    // In a real app, this would be an API call to your backend
    // For now, we'll simulate the login
    const response = await fetch(`${process.env.NEXT_PUBLIC_API_BASE_URL}/api/auth/sign-in`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ email, password }),
    });

    if (response.ok) {
      const data = await response.json();
      localStorage.setItem('auth_token', data.access_token);
      return { user: data.user, token: data.access_token };
    }

    return null;
  } catch (error) {
    console.error('Login error:', error);
    return null;
  }
};

// Logout function
export const logout = (): void => {
  localStorage.removeItem('auth_token');
  // Redirect to login page or home page
  window.location.href = '/';
};

// Register function
export const register = async (email: string, password: string, firstName?: string, lastName?: string): Promise<{ user: User; token: string } | null> => {
  try {
    const response = await fetch(`${process.env.NEXT_PUBLIC_API_BASE_URL}/api/auth/sign-up`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ email, password, firstName, lastName }),
    });

    if (response.ok) {
      const data = await response.json();
      localStorage.setItem('auth_token', data.access_token);
      return { user: data.user, token: data.access_token };
    }

    return null;
  } catch (error) {
    console.error('Registration error:', error);
    return null;
  }
};