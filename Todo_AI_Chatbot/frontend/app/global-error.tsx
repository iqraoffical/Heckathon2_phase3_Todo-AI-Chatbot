'use client';

import { useEffect } from 'react';
import { Button } from '@/components/ui/button';
import Link from 'next/link';
import { Card, CardContent } from '@/components/ui/card';
import { RotateCcw, Home, Sparkles } from 'lucide-react';

export default function GlobalError({
  error,
  reset,
}: {
  error: Error;
  reset: () => void;
}) {
  useEffect(() => {
    // Log the error to an error reporting service
    console.error(error);
  }, [error]);

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-indigo-50 via-purple-50 to-pink-50 p-4">
      <div className="max-w-md w-full">
        <Card className="glass backdrop-blur-xl border-white/30 shadow-xl text-center bg-gradient-to-br from-white/30 to-white/10">
          <CardContent className="py-12 px-6">
            <div className="mx-auto flex justify-center">
              <div className="relative">
                <div className="w-24 h-24 rounded-full bg-gradient-to-r from-red-500 via-orange-500 to-pink-500 flex items-center justify-center">
                  <svg className="h-12 w-12 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
                  </svg>
                </div>
              </div>
            </div>

            <h1 className="mt-6 text-4xl font-bold bg-gradient-to-r from-red-600 via-orange-500 to-pink-500 bg-clip-text text-transparent">
              Oops!
            </h1>
            <h2 className="mt-2 text-2xl font-semibold text-gray-900">Something went wrong</h2>
            <p className="mt-4 text-gray-700">
              {error.message || 'An unexpected error occurred. Please try again.'}
            </p>

            <div className="mt-8 flex flex-col sm:flex-row gap-4 justify-center">
              <Button
                onClick={() => reset()}
                className="bg-gradient-to-r from-purple-600 via-pink-500 to-blue-500 hover:from-purple-700 hover:via-pink-600 hover:to-blue-600 text-white"
              >
                <RotateCcw className="h-4 w-4 mr-2" />
                Try Again
              </Button>
              <Button asChild variant="outline" className="border-purple-300 text-purple-700 bg-white/50 hover:bg-purple-50">
                <Link href="/">
                  <Home className="h-4 w-4 mr-2" />
                  Back to Home
                </Link>
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}