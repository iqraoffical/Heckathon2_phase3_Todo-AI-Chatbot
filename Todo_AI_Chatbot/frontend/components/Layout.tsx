// components/Layout.tsx
import React from 'react';
import Link from 'next/link';

interface LayoutProps {
  children: React.ReactNode;
}

const Layout: React.FC<LayoutProps> = ({ children }) => {
  return (
    <div className="min-h-screen bg-gray-100">
      {/* Navigation Bar */}
      <nav className="bg-blue-600 text-white shadow-md">
        <div className="container mx-auto px-4">
          <div className="flex justify-between items-center h-16">
            <Link href="/" className="text-xl font-bold">
              Todo AI Chatbot
            </Link>
            <div className="flex space-x-4">
              <Link href="/tasks" className="hover:bg-blue-700 px-3 py-2 rounded">
                Tasks
              </Link>
              <Link href="/chat" className="hover:bg-blue-700 px-3 py-2 rounded">
                Chat
              </Link>
              <Link href="/profile" className="hover:bg-blue-700 px-3 py-2 rounded">
                Profile
              </Link>
            </div>
          </div>
        </div>
      </nav>

      {/* Main Content */}
      <main className="container mx-auto px-4 py-8">
        {children}
      </main>

      {/* Footer */}
      <footer className="bg-gray-800 text-white py-6 mt-12">
        <div className="container mx-auto px-4 text-center">
          <p>© {new Date().getFullYear()} Todo AI Chatbot. All rights reserved.</p>
        </div>
      </footer>
    </div>
  );
};

export default Layout;