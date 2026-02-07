// lib/auth-client.ts - Client for your Python backend
import type { User, AuthResponse, Session } from '../types';

// Base URL for your Python backend
const API_BASE_URL = process.env.NEXT_PUBLIC_API_BASE_URL || 'http://localhost:8000';

// Helper function to get stored token
const getToken = (): string | null => {
  if (typeof window !== 'undefined') {
    return localStorage.getItem('access_token');
  }
  return null;
};

// Helper function to store token
const setToken = (token: string): void => {
  if (typeof window !== 'undefined') {
    localStorage.setItem('access_token', token);
  }
};

// Helper function to remove token
const removeToken = (): void => {
  if (typeof window !== 'undefined') {
    localStorage.removeItem('access_token');
  }
};

// Sign in function
const signIn = async (email: string, password: string) => {
  try {
    const response = await fetch(`${API_BASE_URL}/api/auth/sign-in`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ email, password }),
    });

    const data: AuthResponse = await response.json();

    if (!response.ok) {
      throw new Error(data.detail || 'Sign in failed');
    }

    // Store the token
    setToken(data.access_token);

    return { success: true, data };
  } catch (error) {
    console.error('Sign in error:', error);
    return { success: false, error: error instanceof Error ? error.message : 'Unknown error' };
  }
};

// Sign up function
const signUp = async (email: string, password: string, name: string) => {
  try {
    const response = await fetch(`${API_BASE_URL}/api/auth/sign-up`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ email, password, name }),
    });

    const data: AuthResponse = await response.json();

    if (!response.ok) {
      throw new Error(data.detail || 'Sign up failed');
    }

    // Store the token
    setToken(data.access_token);

    return { success: true, data };
  } catch (error) {
    console.error('Sign up error:', error);
    return { success: false, error: error instanceof Error ? error.message : 'Unknown error' };
  }
};

// Sign out function
const signOut = async () => {
  removeToken();
  return { success: true };
};

// Get session function
const getSession = async (): Promise<Session | null> => {
  const token = getToken();

  if (!token) {
    return null;
  }

  try {
    const response = await fetch(`${API_BASE_URL}/api/auth/verify-token`, {
      method: 'GET',
      headers: {
        'Authorization': `Bearer ${token}`,
      },
    });

    const userData: User = await response.json();

    if (!response.ok) {
      // If token is invalid, remove it
      if (response.status === 401) {
        removeToken();
      }
      return null;
    }

    return { user: userData, access_token: token };
  } catch (error) {
    console.error('Get session error:', error);
    return null;
  }
};

export { signIn, signOut, signUp, getSession, getToken };