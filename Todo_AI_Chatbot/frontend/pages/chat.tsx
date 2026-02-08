// pages/chat.tsx
import React from 'react';
import Head from 'next/head';
import ChatInterface from '../components/ChatInterface';

// Mock user ID - in a real app, this would come from authentication
const userId = '123e4567-e89b-12d3-a456-426614174000';

const ChatPage: React.FC = () => {
  return (
    <div className="min-h-screen bg-gray-100">
      <Head>
        <title>AI Chat | Todo AI Chatbot</title>
        <meta name="description" content="Chat with your AI task assistant" />
      </Head>

      <div className="container mx-auto px-4 py-8">
        <div className="max-w-4xl mx-auto">
          <h1 className="text-3xl font-bold text-center text-gray-800 mb-8">AI Task Assistant</h1>
          <ChatInterface userId={userId} />
        </div>
      </div>
    </div>
  );
};

export default ChatPage;