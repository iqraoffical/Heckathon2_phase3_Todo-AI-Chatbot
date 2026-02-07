'use client';

import { useState } from 'react';
import { motion } from 'framer-motion';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { signUp } from '../../lib/auth-client';
import { User, Mail, Lock, ArrowLeft, Sparkles } from 'lucide-react';

export default function SignupPage() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [name, setName] = useState('');
  const [error, setError] = useState('');
  const router = useRouter();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    try {
      // Using Better Auth's signUp function
      await signUp({
        email,
        password,
        name, // Assuming the backend supports name during signup
      });

      // On successful signup, redirect to signin page
      router.push('/signin');
    } catch (err) {
      setError('An error occurred during signup');
      console.error(err);
    }
  };

  return (
    <div className="pt-24 flex items-center justify-center p-4 bg-gradient-to-br from-black via-gray-900 to-black min-h-[calc(100vh-200px)]">
      <div className="w-full max-w-md">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
        >
          <Card className="glass backdrop-blur-xl border-yellow-500/30 shadow-xl bg-gradient-to-br from-black/30 to-black/10">
            <CardHeader className="space-y-1 text-center">
              <div className="mx-auto bg-gradient-to-r from-yellow-500 to-yellow-600 p-3 rounded-full w-16 h-16 flex items-center justify-center">
                <Sparkles className="h-8 w-8 text-black" />
              </div>
              <CardTitle className="text-2xl font-bold bg-gradient-to-r from-yellow-500 via-yellow-600 to-yellow-700 bg-clip-text text-transparent">
                Create Account
              </CardTitle>
              <CardDescription className="text-gray-300 text-secondary">
                Enter your details to get started
              </CardDescription>
            </CardHeader>
            <form onSubmit={handleSubmit}>
              <CardContent className="space-y-4">
                {error && (
                  <div className="rounded-md bg-red-500/20 p-3 text-red-300 text-sm text-secondary">
                    {error}
                  </div>
                )}

                <div className="space-y-2">
                  <Label htmlFor="name" className="text-white">Full Name</Label>
                  <div className="relative">
                    <User className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-yellow-500" />
                    <Input
                      id="name"
                      name="name"
                      type="text"
                      required
                      placeholder="John Doe"
                      className="pl-10 bg-black/20 border-yellow-500/30 text-white placeholder:text-yellow-300"
                      value={name}
                      onChange={(e) => setName(e.target.value)}
                    />
                  </div>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="email-address" className="text-white">Email Address</Label>
                  <div className="relative">
                    <Mail className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-yellow-500" />
                    <Input
                      id="email-address"
                      name="email"
                      type="email"
                      autoComplete="email"
                      required
                      placeholder="john@example.com"
                      className="pl-10 bg-black/20 border-yellow-500/30 text-white placeholder:text-yellow-300"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                    />
                  </div>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="password" className="text-white">Password</Label>
                  <div className="relative">
                    <Lock className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-yellow-500" />
                    <Input
                      id="password"
                      name="password"
                      type="password"
                      autoComplete="current-password"
                      required
                      placeholder="••••••••"
                      className="pl-10 bg-black/20 border-yellow-500/30 text-white placeholder:text-yellow-300"
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                    />
                  </div>
                </div>
              </CardContent>
              <CardFooter className="flex flex-col">
                <Button type="submit" className="w-full bg-gradient-to-r from-yellow-500 to-yellow-600 hover:from-yellow-600 hover:to-yellow-700 text-black">
                  Create Account
                </Button>
                <div className="mt-4 text-center text-sm text-gray-300 text-secondary">
                  Already have an account?{' '}
                  <Link href="/signin" className="font-semibold text-yellow-400 hover:underline">
                    Sign in
                  </Link>
                </div>
              </CardFooter>
            </form>
          </Card>

          <div className="mt-6 text-center">
            <Button variant="ghost" asChild className="text-gray-300 text-secondary hover:text-yellow-400">
              <Link href="/">
                <ArrowLeft className="mr-2 h-4 w-4" /> Back to Home
              </Link>
            </Button>
          </div>
        </motion.div>
      </div>
    </div>
  );
}