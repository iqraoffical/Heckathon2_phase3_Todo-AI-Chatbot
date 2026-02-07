'use client';

import { useState, useEffect } from 'react';

// Custom authentication functions to work with our backend API
export const signIn = async (provider: string, credentials: { email: string; password: string; redirectTo?: string }) => {
  try {
    const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8000'}/api/auth/sign-in`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        email: credentials.email,
        password: credentials.password,
      }),
    });

    const data = await response.json();

    if (!response.ok) {
      throw new Error(data.detail || 'Sign in failed');
    }

    // Store the token in localStorage or sessionStorage
    if (data.access_token) {
      localStorage.setItem('auth_token', data.access_token);
    }

    return { success: true, data };
  } catch (error) {
    console.error('Sign in error:', error);
    return { error: error instanceof Error ? error.message : 'An unexpected error occurred' };
  }
};

export const signOut = async () => {
  try {
    // Clear the stored token
    localStorage.removeItem('auth_token');

    return { success: true };
  } catch (error) {
    console.error('Sign out error:', error);
    return { error: error instanceof Error ? error.message : 'An unexpected error occurred' };
  }
};

export const signUp = async (userData: { email: string; password: string; name: string }) => {
  try {
    const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8000'}/api/auth/sign-up`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(userData),
    });

    const data = await response.json();

    if (!response.ok) {
      throw new Error(data.detail || 'Sign up failed');
    }

    // Store the token in localStorage or sessionStorage
    if (data.access_token) {
      localStorage.setItem('auth_token', data.access_token);
    }

    return { success: true, data };
  } catch (error) {
    console.error('Sign up error:', error);
    return { error: error instanceof Error ? error.message : 'An unexpected error occurred' };
  }
};

// Custom hook to manage session state
export const useSessionWithHydration = () => {
  const [isMounted, setIsMounted] = useState(false);
  const [sessionState, setSessionState] = useState({
    data: null,
    isLoading: true,
    isError: false,
    error: null
  });

  // Check for token in localStorage to determine session status
  useEffect(() => {
    setIsMounted(true);

    const token = localStorage.getItem('auth_token');
    if (token) {
      // In a real implementation, you might want to validate the token with an API call
      setSessionState({
        data: { user: { token } }, // Simplified user object
        isLoading: false,
        isError: false,
        error: null
      });
    } else {
      setSessionState({
        data: null,
        isLoading: false,
        isError: false,
        error: null
      });
    }
  }, []);

  // Return empty session during SSR/hydration
  if (!isMounted) {
    return { data: null, isLoading: true, isError: false, error: null };
  }

  return sessionState;
};

// Helper function to get the JWT token from storage
export const getJwtToken = async (): Promise<string | null> => {
  try {
    const token = localStorage.getItem('auth_token');
    return token || null;
  } catch (error) {
    console.error('Error getting JWT token:', error);
    return null;
  }
};