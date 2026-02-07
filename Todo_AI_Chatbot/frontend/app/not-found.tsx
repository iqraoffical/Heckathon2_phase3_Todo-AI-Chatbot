'use client';

import { motion } from 'framer-motion';
import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Home, Search, AlertTriangle, Sparkles } from 'lucide-react';

export default function NotFound() {
  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-indigo-50 via-purple-50 to-pink-50 p-4">
      <div className="max-w-md w-full">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
        >
          <Card className="glass backdrop-blur-xl border-white/30 shadow-xl text-center bg-gradient-to-br from-white/30 to-white/10">
            <CardContent className="py-12 px-6">
              <div className="mx-auto flex justify-center">
                <div className="relative">
                  <div className="w-24 h-24 rounded-full bg-gradient-to-r from-purple-500 via-pink-500 to-blue-500 flex items-center justify-center">
                    <AlertTriangle className="h-12 w-12 text-white" />
                  </div>
                  <div className="absolute -top-2 -right-2 w-10 h-10 rounded-full bg-gradient-to-r from-yellow-400 to-orange-400 flex items-center justify-center animate-ping">
                    <div className="w-6 h-6 rounded-full bg-yellow-300"></div>
                  </div>
                </div>
              </div>

              <h1 className="mt-6 text-4xl font-bold bg-gradient-to-r from-purple-600 via-pink-500 to-blue-500 bg-clip-text text-transparent">
                404
              </h1>
              <h2 className="mt-2 text-2xl font-semibold text-gray-900">Page Not Found</h2>
              <p className="mt-4 text-gray-700">
                Oops! The page you're looking for doesn't exist or has been moved.
              </p>

              <div className="mt-8 flex flex-col sm:flex-row gap-4 justify-center">
                <Button asChild className="bg-gradient-to-r from-purple-600 via-pink-500 to-blue-500 hover:from-purple-700 hover:via-pink-600 hover:to-blue-600 text-white">
                  <Link href="/">
                    <Home className="h-4 w-4 mr-2" />
                    Back to Home
                  </Link>
                </Button>
                <Button asChild variant="outline" className="border-purple-300 text-purple-700 bg-white/50 hover:bg-purple-50">
                  <Link href="/tasks">
                    <Search className="h-4 w-4 mr-2" />
                    Go to Tasks
                  </Link>
                </Button>
              </div>
            </CardContent>
          </Card>
        </motion.div>
      </div>
    </div>
  );
}