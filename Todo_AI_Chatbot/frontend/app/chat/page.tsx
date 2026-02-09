// app/chat/page.tsx
'use client';

import React, { useState, useRef, useEffect } from 'react';
import { Message, ChatResponse } from '../../lib/types';
import { chatApi } from '../../lib/api';
import ChatInterface from '../../components/ChatInterface';
import { getCurrentSession } from '../../lib/auth-client';
import { useRouter } from 'next/navigation';

export default function ChatPage() {
  const [user, setUser] = useState<any>(null);
  const router = useRouter();

  useEffect(() => {
    const checkAuth = async () => {
      try {
        const session = await getCurrentSession();
        if (!session?.user) {
          // Redirect to sign in if not authenticated
          router.push('/signin');
          return;
        }
        
        setUser(session.user);
      } catch (error) {
        console.error('Error checking auth:', error);
        router.push('/signin');
      }
    };

    checkAuth();
  }, [router]);

  if (!user) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500 mx-auto"></div>
          <p className="mt-4 text-gray-600">Checking authentication...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Navigation */}
      <nav className="bg-white shadow-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between h-16">
            <div className="flex items-center">
              <a href="/" className="flex-shrink-0 flex items-center">
                <span className="text-xl font-bold text-blue-600">Todo AI</span>
              </a>
            </div>
            <div className="hidden md:flex items-center space-x-8">
              <a href="/tasks" className="text-gray-700 hover:text-blue-600 font-medium">
                Tasks
              </a>
              <a href="/chat" className="text-blue-600 font-medium border-b-2 border-blue-600">
                Chat
              </a>
              <a href="/profile" className="text-gray-700 hover:text-blue-600 font-medium">
                {user?.firstName || user?.email?.split('@')[0] || 'Profile'}
              </a>
            </div>
          </div>
        </div>
      </nav>

      <div className="container mx-auto px-4 py-8">
        <div className="max-w-4xl mx-auto">
          <div className="bg-white rounded-xl shadow-md overflow-hidden">
            <div className="p-6 border-b border-gray-200">
              <h1 className="text-2xl font-bold text-gray-800">AI Task Assistant</h1>
              <p className="text-gray-600 mt-1">Ask me to manage your tasks</p>
            </div>
            <div className="p-6">
              <ChatInterface userId={user.id} />
            </div>
          </div>
        </div>
      </div>

      {/* Footer */}
      <footer className="bg-gray-800 text-white py-8 mt-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <p className="text-gray-400">
            &copy; {new Date().getFullYear()} Todo AI Chatbot. All rights reserved.
          </p>
        </div>
      </footer>
    </div>
  );
}