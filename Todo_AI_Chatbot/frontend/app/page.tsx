// app/page.tsx
'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { getCurrentSession } from '../lib/auth-client';

export default function HomePage() {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [user, setUser] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const checkAuthStatus = async () => {
      try {
        const session = await getCurrentSession();
        setUser(session?.user || null);
      } catch (error) {
        console.error('Error checking auth status:', error);
      } finally {
        setLoading(false);
      }
    };

    checkAuthStatus();
  }, []);

  const handleLogout = async () => {
    try {
      // Clear user session
      setUser(null);
      // In a real app, you would call a logout function here
    } catch (error) {
      console.error('Logout error:', error);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100">
      {/* Navigation */}
      <nav className="bg-white shadow-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between h-16">
            <div className="flex items-center">
              <Link href="/" className="flex-shrink-0 flex items-center">
                <span className="text-xl font-bold text-blue-600">Todo AI</span>
              </Link>
            </div>
            <div className="hidden md:flex items-center space-x-8">
              <Link href="/tasks" className="text-gray-700 hover:text-blue-600 font-medium">
                Tasks
              </Link>
              <Link href="/chat" className="text-gray-700 hover:text-blue-600 font-medium">
                Chat
              </Link>
              {loading ? (
                <div className="h-8 w-24 bg-gray-200 rounded-md animate-pulse"></div>
              ) : user ? (
                <div className="flex items-center space-x-4">
                  <Link href="/profile" className="text-gray-700 hover:text-blue-600 font-medium">
                    {user.firstName || user.email.split('@')[0]}
                  </Link>
                  <button 
                    onClick={handleLogout}
                    className="px-4 py-2 border border-transparent rounded-md text-base font-medium text-blue-700 bg-blue-100 hover:bg-blue-200"
                  >
                    Sign out
                  </button>
                </div>
              ) : (
                <div className="flex space-x-3">
                  <Link 
                    href="/signin" 
                    className="px-4 py-2 border border-transparent rounded-md text-base font-medium text-blue-700 bg-blue-100 hover:bg-blue-200"
                  >
                    Sign in
                  </Link>
                  <Link 
                    href="/signup" 
                    className="px-4 py-2 border border-transparent rounded-md text-base font-medium text-white bg-blue-600 hover:bg-blue-700"
                  >
                    Sign up
                  </Link>
                </div>
              )}
            </div>
            <div className="md:hidden flex items-center">
              <button
                onClick={() => setIsMenuOpen(!isMenuOpen)}
                className="inline-flex items-center justify-center p-2 rounded-md text-gray-700 hover:text-blue-600 focus:outline-none"
              >
                <svg className="h-6 w-6" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
                </svg>
              </button>
            </div>
          </div>
        </div>

        {/* Mobile menu */}
        {isMenuOpen && (
          <div className="md:hidden">
            <div className="px-2 pt-2 pb-3 space-y-1 sm:px-3 bg-white shadow-lg">
              <Link href="/tasks" className="block px-3 py-2 rounded-md text-base font-medium text-gray-700 hover:text-blue-600 hover:bg-gray-50">
                Tasks
              </Link>
              <Link href="/chat" className="block px-3 py-2 rounded-md text-base font-medium text-gray-700 hover:text-blue-600 hover:bg-gray-50">
                Chat
              </Link>
              {loading ? (
                <div className="h-10 w-full bg-gray-200 rounded-md animate-pulse"></div>
              ) : user ? (
                <>
                  <Link href="/profile" className="block px-3 py-2 rounded-md text-base font-medium text-gray-700 hover:text-blue-600 hover:bg-gray-50">
                    {user.firstName || user.email.split('@')[0]}
                  </Link>
                  <button 
                    onClick={handleLogout}
                    className="block w-full text-left px-3 py-2 rounded-md text-base font-medium text-blue-700 bg-blue-100 hover:bg-blue-200"
                  >
                    Sign out
                  </button>
                </>
              ) : (
                <>
                  <Link href="/signin" className="block px-3 py-2 rounded-md text-base font-medium text-blue-700 bg-blue-100">
                    Sign in
                  </Link>
                  <Link href="/signup" className="block px-3 py-2 rounded-md text-base font-medium text-white bg-blue-600">
                    Sign up
                  </Link>
                </>
              )}
            </div>
          </div>
        )}
      </nav>

      {/* Hero Section */}
      <div className="container mx-auto px-4 py-16">
        <div className="max-w-3xl mx-auto text-center">
          <h1 className="text-4xl md:text-5xl font-bold text-gray-800 mb-6">
            Intelligent Task Management with AI
          </h1>
          
          <p className="text-lg text-gray-600 mb-10 max-w-2xl mx-auto">
            Our AI-powered chatbot helps you manage your tasks effortlessly. 
            Simply talk to the bot to add, update, complete, or delete tasks.
          </p>
          
          <div className="flex flex-col sm:flex-row justify-center gap-4 mb-16">
            {user ? (
              <>
                <Link 
                  href="/tasks" 
                  className="px-8 py-3 bg-blue-600 text-white font-medium rounded-lg hover:bg-blue-700 transition duration-300 shadow-md"
                >
                  View Tasks
                </Link>
                <Link 
                  href="/chat" 
                  className="px-8 py-3 bg-indigo-600 text-white font-medium rounded-lg hover:bg-indigo-700 transition duration-300 shadow-md"
                >
                  Talk to AI Assistant
                </Link>
              </>
            ) : (
              <Link 
                href="/signin" 
                className="px-8 py-3 bg-blue-600 text-white font-medium rounded-lg hover:bg-blue-700 transition duration-300 shadow-md"
              >
                Get Started
              </Link>
            )}
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mt-16">
            <div className="bg-white p-6 rounded-xl shadow-md border border-gray-100">
              <div className="w-12 h-12 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-blue-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
                </svg>
              </div>
              <h3 className="text-xl font-semibold mb-2">Easy Task Management</h3>
              <p className="text-gray-600">
                Add, edit, and organize your tasks with an intuitive interface.
              </p>
            </div>
            
            <div className="bg-white p-6 rounded-xl shadow-md border border-gray-100">
              <div className="w-12 h-12 bg-indigo-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-indigo-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 117.072 0l-.548.547A3.374 3.374 0 0014 18.469V19a2 2 0 11-4 0v-.531c0-.895-.356-1.754-.988-2.386l-.548-.547z" />
                </svg>
              </div>
              <h3 className="text-xl font-semibold mb-2">AI-Powered Assistance</h3>
              <p className="text-gray-600">
                Natural language processing to manage tasks through conversation.
              </p>
            </div>
            
            <div className="bg-white p-6 rounded-xl shadow-md border border-gray-100">
              <div className="w-12 h-12 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-green-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
                </svg>
              </div>
              <h3 className="text-xl font-semibold mb-2">Secure & Private</h3>
              <p className="text-gray-600">
                Your data is encrypted and securely stored in our databases.
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Footer */}
      <footer className="bg-gray-800 text-white py-12 mt-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="md:flex md:items-center md:justify-between">
            <div className="flex justify-center md:justify-start">
              <span className="text-xl font-bold text-white">Todo AI</span>
            </div>
            <div className="mt-8 md:mt-0 md:order-1">
              <p className="text-center text-gray-400 text-base">
                &copy; {new Date().getFullYear()} Todo AI Chatbot. All rights reserved.
              </p>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
}