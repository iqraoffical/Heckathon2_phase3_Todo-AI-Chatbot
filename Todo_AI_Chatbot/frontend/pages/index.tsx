// pages/index.tsx
import React from 'react';
import Head from 'next/head';
import Link from 'next/link';

const HomePage: React.FC = () => {
  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100">
      <Head>
        <title>Todo AI Chatbot - Manage Tasks with AI</title>
        <meta name="description" content="An intelligent task management system with AI assistance" />
      </Head>

      <div className="container mx-auto px-4 py-16">
        <div className="max-w-3xl mx-auto text-center">
          <h1 className="text-4xl md:text-5xl font-bold text-gray-800 mb-6">
            Intelligent Task Management with AI
          </h1>
          
          <p className="text-lg text-gray-600 mb-10">
            Our AI-powered chatbot helps you manage your tasks effortlessly. 
            Simply talk to the bot to add, update, complete, or delete tasks.
          </p>
          
          <div className="flex flex-col sm:flex-row justify-center gap-4 mb-12">
            <Link 
              href="/tasks" 
              className="px-6 py-3 bg-blue-600 text-white font-medium rounded-lg hover:bg-blue-700 transition duration-300"
            >
              View Tasks
            </Link>
            <Link 
              href="/chat" 
              className="px-6 py-3 bg-indigo-600 text-white font-medium rounded-lg hover:bg-indigo-700 transition duration-300"
            >
              Talk to AI Assistant
            </Link>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mt-16">
            <div className="bg-white p-6 rounded-lg shadow-md">
              <div className="text-blue-600 text-3xl mb-4">✓</div>
              <h3 className="text-xl font-semibold mb-2">Easy Task Management</h3>
              <p className="text-gray-600">
                Add, edit, and organize your tasks with a simple interface.
              </p>
            </div>
            
            <div className="bg-white p-6 rounded-lg shadow-md">
              <div className="text-blue-600 text-3xl mb-4">🤖</div>
              <h3 className="text-xl font-semibold mb-2">AI-Powered Assistance</h3>
              <p className="text-gray-600">
                Natural language processing to manage tasks through conversation.
              </p>
            </div>
            
            <div className="bg-white p-6 rounded-lg shadow-md">
              <div className="text-blue-600 text-3xl mb-4">🔒</div>
              <h3 className="text-xl font-semibold mb-2">Secure & Private</h3>
              <p className="text-gray-600">
                Your data is encrypted and securely stored in our databases.
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default HomePage;