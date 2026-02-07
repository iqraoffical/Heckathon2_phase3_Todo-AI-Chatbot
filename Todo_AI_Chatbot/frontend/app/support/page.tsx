import Link from 'next/link';
import { HelpCircle, BookOpen, MessageCircle, ExternalLink } from 'lucide-react';
import { Button } from '@/components/ui/button';

export default function SupportPage() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-indigo-50 via-purple-50 to-pink-50 py-12">
      <div className="max-w-6xl mx-auto px-4">
        <Link href="/" className="inline-flex items-center text-purple-600 hover:text-purple-800 mb-8">
          <span>← Back to Home</span>
        </Link>
        
        <div className="text-center mb-12">
          <h1 className="text-3xl font-bold text-gray-900 mb-4">Support Center</h1>
          <p className="text-gray-700 max-w-2xl mx-auto">
            Find answers to common questions, browse our documentation, or get in touch with our support team.
          </p>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-12">
          <div className="bg-white/70 backdrop-blur-lg rounded-2xl shadow-xl p-8 border border-white/30 text-center">
            <div className="p-3 bg-gradient-to-r from-purple-500/20 to-pink-500/20 rounded-full w-16 h-16 flex items-center justify-center mx-auto mb-6">
              <BookOpen className="h-8 w-8 text-purple-600" />
            </div>
            <h2 className="text-xl font-bold text-gray-900 mb-3">Documentation</h2>
            <p className="text-gray-700 mb-4">
              Comprehensive guides and tutorials to help you get the most out of TaskFlow.
            </p>
            <Button variant="outline" className="border-purple-300 text-purple-700 hover:bg-purple-50">
              Browse Docs <ExternalLink className="ml-2 h-4 w-4" />
            </Button>
          </div>
          
          <div className="bg-white/70 backdrop-blur-lg rounded-2xl shadow-xl p-8 border border-white/30 text-center">
            <div className="p-3 bg-gradient-to-r from-purple-500/20 to-pink-500/20 rounded-full w-16 h-16 flex items-center justify-center mx-auto mb-6">
              <HelpCircle className="h-8 w-8 text-purple-600" />
            </div>
            <h2 className="text-xl font-bold text-gray-900 mb-3">FAQ</h2>
            <p className="text-gray-700 mb-4">
              Find quick answers to commonly asked questions about TaskFlow.
            </p>
            <Button variant="outline" className="border-purple-300 text-purple-700 hover:bg-purple-50">
              View FAQ <ExternalLink className="ml-2 h-4 w-4" />
            </Button>
          </div>
          
          <div className="bg-white/70 backdrop-blur-lg rounded-2xl shadow-xl p-8 border border-white/30 text-center">
            <div className="p-3 bg-gradient-to-r from-purple-500/20 to-pink-500/20 rounded-full w-16 h-16 flex items-center justify-center mx-auto mb-6">
              <MessageCircle className="h-8 w-8 text-purple-600" />
            </div>
            <h2 className="text-xl font-bold text-gray-900 mb-3">Contact Support</h2>
            <p className="text-gray-700 mb-4">
              Need personalized help? Our support team is here for you.
            </p>
            <Button className="bg-gradient-to-r from-purple-600 via-pink-500 to-blue-500 hover:from-purple-700 hover:via-pink-600 hover:to-blue-600 text-white">
              Get Support <ExternalLink className="ml-2 h-4 w-4" />
            </Button>
          </div>
        </div>
        
        <div className="bg-white/70 backdrop-blur-lg rounded-2xl shadow-xl p-8 border border-white/30">
          <h2 className="text-2xl font-bold text-gray-900 mb-6">Popular Topics</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="p-4 hover:bg-white/30 rounded-lg transition-colors">
              <h3 className="font-semibold text-gray-900">Getting Started</h3>
              <p className="text-gray-700 text-sm mt-1">Learn the basics of TaskFlow and set up your account.</p>
            </div>
            <div className="p-4 hover:bg-white/30 rounded-lg transition-colors">
              <h3 className="font-semibold text-gray-900">Managing Tasks</h3>
              <p className="text-gray-700 text-sm mt-1">Create, assign, and track tasks efficiently.</p>
            </div>
            <div className="p-4 hover:bg-white/30 rounded-lg transition-colors">
              <h3 className="font-semibold text-gray-900">Collaboration</h3>
              <p className="text-gray-700 text-sm mt-1">Work with your team and share projects.</p>
            </div>
            <div className="p-4 hover:bg-white/30 rounded-lg transition-colors">
              <h3 className="font-semibold text-gray-900">Billing & Plans</h3>
              <p className="text-gray-700 text-sm mt-1">Manage your subscription and payment methods.</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}