'use client';

import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { apiClient } from '@/lib/api';
import Sidebar from '@/components/Sidebar';

interface UserProfile {
  id: string;
  email: string;
  name: string;
  username?: string;
  bio?: string;
  avatar?: string;
  createdAt: string;
}

export default function ProfilePage() {
  const [user, setUser] = useState<UserProfile | null>(null);
  const [loading, setLoading] = useState(true);
  const [editing, setEditing] = useState(false);
  const [formData, setFormData] = useState<Partial<UserProfile>>({});

  useEffect(() => {
    const fetchUserProfile = async () => {
      try {
        // In a real app, you would fetch the user profile from the API
        // For now, we'll simulate with mock data
        const mockUser: UserProfile = {
          id: 'user-123',
          email: 'user@example.com',
          name: 'John Doe',
          username: 'johndoe',
          bio: 'Software developer passionate about creating amazing user experiences.',
          avatar: '',
          createdAt: '2023-01-15',
        };
        
        setUser(mockUser);
        setFormData(mockUser);
        setLoading(false);
      } catch (error) {
        console.error('Error fetching user profile:', error);
        setLoading(false);
      }
    };

    fetchUserProfile();
  }, []);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    try {
      // In a real app, you would update the user profile via API
      // For now, we'll just update the local state
      setUser(prev => ({ ...prev!, ...formData }) as UserProfile);
      setEditing(false);
    } catch (error) {
      console.error('Error updating profile:', error);
    }
  };

  if (loading) {
    return (
      <div className="pt-32 p-4 md:p-8 bg-gradient-to-br from-black via-gray-900 to-black min-h-[calc(100vh-200px)] flex items-center justify-center">
        <div className="text-white text-xl">Loading profile...</div>
      </div>
    );
  }

  return (
    <div className="pt-32 p-4 md:p-8 bg-gradient-to-br from-black via-gray-900 to-black min-h-[calc(100vh-200px)]">
      <div className="flex">
        <Sidebar />
        <div className="flex-1 md:ml-64">
          <div className="max-w-4xl mx-auto">
            {/* Header */}
            <motion.div
              initial={{ opacity: 0, y: -20 }}
              animate={{ opacity: 1, y: 0 }}
              className="mb-8"
            >
              <h1 className="text-3xl md:text-4xl font-bold bg-gradient-to-r from-yellow-500 via-yellow-600 to-yellow-700 bg-clip-text text-transparent font-extrabold">
                Profile Settings
              </h1>
              <p className="text-gray-300 mt-2 font-medium">Manage your account information</p>
            </motion.div>

            {/* Profile Card */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.1 }}
            >
              <Card className="glass backdrop-blur-xl border-yellow-500/30 bg-gradient-to-br from-black/30 to-black/10">
                <CardHeader>
                  <CardTitle className="text-white font-bold">Your Profile</CardTitle>
                </CardHeader>
                <CardContent>
                  {editing ? (
                    <form onSubmit={handleSubmit} className="space-y-6">
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        <div>
                          <Label htmlFor="name" className="text-white">Full Name</Label>
                          <Input
                            id="name"
                            name="name"
                            value={formData.name || ''}
                            onChange={handleInputChange}
                            className="bg-black/20 border-yellow-500/30 text-white placeholder:text-yellow-300"
                          />
                        </div>
                        
                        <div>
                          <Label htmlFor="email" className="text-white">Email Address</Label>
                          <Input
                            id="email"
                            name="email"
                            type="email"
                            value={formData.email || ''}
                            onChange={handleInputChange}
                            className="bg-black/20 border-yellow-500/30 text-white placeholder:text-yellow-300"
                          />
                        </div>
                        
                        <div>
                          <Label htmlFor="username" className="text-white">Username</Label>
                          <Input
                            id="username"
                            name="username"
                            value={formData.username || ''}
                            onChange={handleInputChange}
                            className="bg-black/20 border-yellow-500/30 text-white placeholder:text-yellow-300"
                          />
                        </div>
                        
                        <div>
                          <Label htmlFor="bio" className="text-white">Bio</Label>
                          <Input
                            id="bio"
                            name="bio"
                            value={formData.bio || ''}
                            onChange={handleInputChange}
                            className="bg-black/20 border-yellow-500/30 text-white placeholder:text-yellow-300"
                          />
                        </div>
                      </div>
                      
                      <div className="flex justify-end space-x-4 pt-4">
                        <Button
                          type="button"
                          variant="outline"
                          onClick={() => {
                            setEditing(false);
                            setFormData(user || {});
                          }}
                          className="border-yellow-500/30 text-white hover:bg-yellow-500/10"
                        >
                          Cancel
                        </Button>
                        <Button
                          type="submit"
                          className="bg-gradient-to-r from-yellow-500 to-yellow-600 hover:from-yellow-600 hover:to-yellow-700 text-black"
                        >
                          Save Changes
                        </Button>
                      </div>
                    </form>
                  ) : (
                    <div className="space-y-6">
                      <div className="flex items-center space-x-6">
                        <div className="h-24 w-24 rounded-full bg-gradient-to-r from-yellow-500 to-yellow-600 flex items-center justify-center text-black font-bold text-2xl">
                          {user?.name?.charAt(0) || 'U'}
                        </div>
                        <div>
                          <h2 className="text-2xl font-bold text-white">{user?.name}</h2>
                          <p className="text-gray-400">{user?.email}</p>
                        </div>
                      </div>
                      
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        <div>
                          <h3 className="text-sm font-medium text-gray-400 mb-1">Username</h3>
                          <p className="text-white">{user?.username || 'Not set'}</p>
                        </div>
                        
                        <div>
                          <h3 className="text-sm font-medium text-gray-400 mb-1">Member Since</h3>
                          <p className="text-white">{user?.createdAt ? new Date(user.createdAt).toLocaleDateString() : 'Unknown'}</p>
                        </div>
                        
                        <div className="md:col-span-2">
                          <h3 className="text-sm font-medium text-gray-400 mb-1">Bio</h3>
                          <p className="text-white">{user?.bio || 'No bio provided'}</p>
                        </div>
                      </div>
                      
                      <div className="pt-4 flex justify-end">
                        <Button
                          onClick={() => setEditing(true)}
                          className="bg-gradient-to-r from-yellow-500 to-yellow-600 hover:from-yellow-600 hover:to-yellow-700 text-black"
                        >
                          Edit Profile
                        </Button>
                      </div>
                    </div>
                  )}
                </CardContent>
              </Card>
            </motion.div>
          </div>
        </div>
      </div>
    </div>
  );
}