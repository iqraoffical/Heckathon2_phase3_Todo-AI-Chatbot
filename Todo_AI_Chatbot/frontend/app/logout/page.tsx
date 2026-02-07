'use client';

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { motion } from 'framer-motion';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { signOut } from '../../lib/auth-client';
import { LogOut, CheckCircle } from 'lucide-react';

export default function LogoutPage() {
  const router = useRouter();

  useEffect(() => {
    // Optionally, you can show a confirmation dialog here
    // For now, we'll proceed directly with logout
    handleLogout();
  }, []);

  const handleLogout = async () => {
    try {
      // Using Better Auth's signOut function
      await signOut();

      // Redirect to home page after logout
      router.push('/');
      router.refresh(); // Refresh to update the UI after logout
    } catch (error) {
      console.error('Error during logout:', error);
      // Optionally, you can show an error message to the user
    }
  };

  return (
    <div className="pt-24 flex items-center justify-center p-4 bg-gradient-to-br from-gray-900 via-indigo-900/70 to-purple-900 min-h-[calc(100vh-200px)]">
      <div className="w-full max-w-md">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
        >
          <Card className="glass backdrop-blur-xl border-white/30 shadow-xl bg-gradient-to-br from-white/30 to-white/10">
            <CardHeader className="space-y-1 text-center">
              <div className="mx-auto bg-gradient-to-r from-purple-500 via-pink-500 to-blue-500 p-3 rounded-full w-16 h-16 flex items-center justify-center">
                <LogOut className="h-8 w-8 text-white" />
              </div>
              <CardTitle className="text-2xl font-bold bg-gradient-to-r from-purple-600 via-pink-500 to-blue-500 bg-clip-text text-transparent">
                Signing Out
              </CardTitle>
              <CardDescription className="text-gray-700">
                You are being logged out of your account
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex justify-center">
                <div className="relative">
                  {/* Animated logout icon */}
                  <div className="absolute -inset-4 bg-gradient-to-r from-purple-500/20 to-pink-500/20 rounded-full blur-md animate-pulse"></div>
                  <div className="relative bg-gradient-to-r from-purple-500 via-pink-500 to-blue-500 p-4 rounded-full">
                    <LogOut className="h-10 w-10 text-white animate-spin" />
                  </div>
                </div>
              </div>
              <p className="text-center text-gray-700">
                Please wait while we securely log you out...
              </p>
            </CardContent>
          </Card>
        </motion.div>
      </div>
    </div>
  );
}