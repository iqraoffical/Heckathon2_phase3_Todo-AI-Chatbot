'use client';

import { Button } from '@/components/ui/button';
import Link from 'next/link';

export default function HomePage() {
  return (
    <main className="min-h-screen bg-gradient-to-br from-black via-gray-900 to-black flex items-center justify-center p-4">
      <div className="max-w-4xl mx-auto text-center">
        <h1 className="text-4xl md:text-6xl font-bold bg-gradient-to-r from-yellow-500 via-yellow-600 to-yellow-700 bg-clip-text text-transparent mb-6 drop-shadow-[0_0_15px_rgba(212,175,55,0.7)] font-extrabold">
          Welcome to TaskFlow
        </h1>

        <p className="text-xl text-gray-300 text-secondary mb-10 max-w-2xl mx-auto drop-shadow-[0_0_8px_rgba(233,213,255,0.5)] font-medium">
          The ultimate task management solution with AI integration.
        </p>

        <div className="flex flex-col sm:flex-row gap-4 justify-center">
          <Button asChild size="lg" className="bg-gradient-to-r from-yellow-500 to-yellow-600 hover:from-yellow-600 hover:to-yellow-700 text-black font-bold shadow-lg shadow-yellow-500/50 text-lg">
            <Link href="/tasks">View Tasks</Link>
          </Button>

          <Button asChild size="lg" className="bg-gradient-to-r from-black to-gray-900 hover:from-black hover:to-gray-800 text-white font-bold shadow-lg shadow-gray-500/50 text-lg border border-yellow-500">
            <Link href="/signup">Create Account</Link>
          </Button>
        </div>
      </div>
    </main>
  );
}
