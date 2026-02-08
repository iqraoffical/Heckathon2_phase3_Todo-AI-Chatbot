// app/chat/page.tsx
'use client';

import React, { useState, useRef, useEffect } from 'react';
import { Message, ChatResponse } from '../../lib/types';
import { chatApi } from '../../lib/api';
import ChatInterface from '../../components/ChatInterface';

// Mock user ID - in a real app, this would come from authentication
const userId = '123e4567-e89b-12d3-a456-426614174000';

export default function ChatPage() {
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
              <a href="/login" className="px-4 py-2 border border-transparent rounded-md text-base font-medium text-blue-700 bg-blue-100 hover:bg-blue-200">
                Sign in
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
              <ChatInterface userId={userId} />
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