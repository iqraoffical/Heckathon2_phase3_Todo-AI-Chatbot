
'use client';
// lib/auth-client.ts
// Note: Since we're using our own auth system instead of better-auth, we'll implement custom functions
import { getCurrentUser } from "./auth";

const API_BASE_URL = process.env.NEXT_PUBLIC_API_BASE_URL || 'http://localhost:8000';

// Sign in function using our custom auth
export const signInUser = async (email: string, password: string) => {
  try {
    const response = await fetch(`${API_BASE_URL}/api/auth/sign-in`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ email, password }),
    });

    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(errorData.detail || 'Sign in failed');
    }

    const data = await response.json();
    
    // Store the token in localStorage
    localStorage.setItem('auth_token', data.access_token);
    
    return data;
  } catch (error) {
    console.error('Sign in error:', error);
    throw error;
  }
};

// Sign up function using our custom auth
export const signUpUser = async (email: string, password: string, firstName?: string, lastName?: string) => {
  try {
    const response = await fetch(`${API_BASE_URL}/api/auth/sign-up`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ email, password, name: firstName || email.split('@')[0] }),
    });

    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(errorData.detail || 'Sign up failed');
    }

    const data = await response.json();
    
    // Store the token in localStorage
    localStorage.setItem('auth_token', data.access_token);
    
    return data;
  } catch (error) {
    console.error('Sign up error:', error);
    throw error;
  }
};

// Sign out function
export const signOutUser = async () => {
  try {
    // Clear the token from localStorage
    localStorage.removeItem('auth_token');
    
    // Optionally make a backend call to invalidate the session
    await fetch(`${API_BASE_URL}/api/auth/sign-out`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${localStorage.getItem('auth_token')}`
      }
    }).catch(() => {}); // Ignore errors during logout
    
    // Optionally redirect to home page after sign out
    window.location.href = '/';
  } catch (error) {
    console.error('Sign out error:', error);
    throw error;
  }
};

// Get current session
export const getCurrentSession = async () => {
  try {
    const token = localStorage.getItem('auth_token');
    if (!token) {
      return null;
    }

    // Verify the token with the backend
    const response = await fetch(`${API_BASE_URL}/api/auth/verify-token`, {
      headers: {
        'Authorization': `Bearer ${token}`
      }
    });

    if (response.ok) {
      const userData = await response.json();
      return {
        user: userData,
        session: { token }
      };
    } else {
      // Token is invalid, remove it
      localStorage.removeItem('auth_token');
      return null;
    }
  } catch (error) {
    console.error('Get session error:', error);
    return null;
  }
};

// Function to get auth headers with JWT token
export const getAuthHeaders = async () => {
  const token = localStorage.getItem('auth_token');
  
  return {
    'Content-Type': 'application/json',
    ...(token && { 'Authorization': `Bearer ${token}` })
  };
};