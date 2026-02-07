'use client';

import { useState } from 'react';
import { motion } from 'framer-motion';
import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import {
  User,
  Mail,
  Lock,
  Bell,
  Sun,
  Moon,
  CreditCard,
  Shield,
  Key,
  Camera,
  Save,
  Edit3,
  Palette,
  Globe
} from 'lucide-react';

export default function ProfilePage() {
  const [activeTab, setActiveTab] = useState('profile');
  const [userData, setUserData] = useState({
    name: 'John Doe',
    email: 'john@example.com',
    bio: 'Software developer passionate about creating amazing user experiences.',
    notifications: {
      email: true,
      push: false,
      sms: true
    },
    theme: 'light'
  });

  const handleInputChange = (field: string, value: string | boolean) => {
    setUserData(prev => ({
      ...prev,
      [field]: value
    }));
  };

  const handleSave = () => {
    // In a real app, this would save the data to the backend
    console.log('Saving user data:', userData);
  };

  return (
    <div className="pt-32 p-4 md:p-8 bg-gradient-to-br from-gray-900 via-indigo-900/70 to-purple-900 min-h-[calc(100vh-200px)]">
      <div className="max-w-6xl mx-auto">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="mb-8"
        >
          <h1 className="text-3xl md:text-4xl font-bold bg-gradient-to-r from-purple-600 via-pink-500 to-blue-500 bg-clip-text text-transparent">
            Profile Settings
          </h1>
          <p className="text-gray-700 mt-2">Manage your account and preferences</p>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
        >
          <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-6">
            <TabsList className="grid w-full grid-cols-3 lg:w-[600px] glass backdrop-blur-xl border-white/30 bg-gradient-to-br from-white/30 to-white/10">
              <TabsTrigger value="profile" className="data-[state=active]:bg-gradient-to-r data-[state=active]:from-purple-500 data-[state=active]:via-pink-500 data-[state=active]:to-blue-500 data-[state=active]:text-white">
                <User className="h-4 w-4 mr-2" />
                Profile
              </TabsTrigger>
              <TabsTrigger value="account" className="data-[state=active]:bg-gradient-to-r data-[state=active]:from-purple-500 data-[state=active]:via-pink-500 data-[state=active]:to-blue-500 data-[state=active]:text-white">
                <Shield className="h-4 w-4 mr-2" />
                Account
              </TabsTrigger>
              <TabsTrigger value="notifications" className="data-[state=active]:bg-gradient-to-r data-[state=active]:from-purple-500 data-[state=active]:via-pink-500 data-[state=active]:to-blue-500 data-[state=active]:text-white">
                <Bell className="h-4 w-4 mr-2" />
                Notifications
              </TabsTrigger>
            </TabsList>

            <TabsContent value="profile" className="space-y-6">
              <Card className="glass backdrop-blur-xl border-white/30 bg-gradient-to-br from-white/30 to-white/10">
                <CardHeader>
                  <CardTitle className="text-gray-900">Profile Information</CardTitle>
                  <CardDescription className="text-gray-700">
                    Update your profile details
                  </CardDescription>
                </CardHeader>
                <CardContent className="space-y-6">
                  <div className="flex items-center space-x-6">
                    <Avatar className="h-24 w-24">
                      <AvatarImage src="/placeholder-avatar.jpg" alt="User avatar" />
                      <AvatarFallback className="bg-gradient-to-r from-purple-500 via-pink-500 to-blue-500 text-white">JD</AvatarFallback>
                    </Avatar>
                    <div className="flex flex-col">
                      <Button variant="outline" className="w-fit border-purple-300 text-purple-700 bg-white/50 hover:bg-purple-50">
                        <Camera className="h-4 w-4 mr-2" />
                        Change Photo
                      </Button>
                      <p className="text-sm text-gray-600 mt-2">JPG, PNG, or GIF (Max 5MB)</p>
                    </div>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div className="space-y-2">
                      <Label htmlFor="name" className="text-gray-700">Full Name</Label>
                      <div className="relative">
                        <User className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-purple-500" />
                        <Input
                          id="name"
                          className="pl-10 bg-white/50 border-white/30 text-gray-900 placeholder:text-gray-500"
                          value={userData.name}
                          onChange={(e) => handleInputChange('name', e.target.value)}
                        />
                      </div>
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="email" className="text-gray-700">Email</Label>
                      <div className="relative">
                        <Mail className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-purple-500" />
                        <Input
                          id="email"
                          type="email"
                          className="pl-10 bg-white/50 border-white/30 text-gray-900 placeholder:text-gray-500"
                          value={userData.email}
                          onChange={(e) => handleInputChange('email', e.target.value)}
                        />
                      </div>
                    </div>

                    <div className="space-y-2 md:col-span-2">
                      <Label htmlFor="bio" className="text-gray-700">Bio</Label>
                      <textarea
                        id="bio"
                        rows={4}
                        className="w-full resize-none rounded-md border border-input bg-white/50 px-3 py-2 text-sm ring-offset-background placeholder:text-gray-500 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50 text-gray-900 backdrop-blur-lg border border-white/30"
                        value={userData.bio}
                        onChange={(e) => handleInputChange('bio', e.target.value)}
                      />
                    </div>
                  </div>

                  <div className="flex justify-end">
                    <Button onClick={handleSave} className="bg-gradient-to-r from-purple-600 via-pink-500 to-blue-500 hover:from-purple-700 hover:via-pink-600 hover:to-blue-600 text-white">
                      <Save className="h-4 w-4 mr-2" />
                      Save Changes
                    </Button>
                  </div>
                </CardContent>
              </Card>
            </TabsContent>

            <TabsContent value="account" className="space-y-6">
              <Card className="glass backdrop-blur-xl border-white/30 bg-gradient-to-br from-white/30 to-white/10">
                <CardHeader>
                  <CardTitle className="text-gray-900">Account Security</CardTitle>
                  <CardDescription className="text-gray-700">
                    Manage your account security settings
                  </CardDescription>
                </CardHeader>
                <CardContent className="space-y-6">
                  <div className="space-y-4">
                    <div className="flex items-center justify-between">
                      <div>
                        <h3 className="font-medium text-gray-900">Change Password</h3>
                        <p className="text-sm text-gray-600">Last changed 3 months ago</p>
                      </div>
                      <Button variant="outline" className="border-purple-300 text-purple-700 bg-white/50 hover:bg-purple-50">
                        <Edit3 className="h-4 w-4 mr-2" />
                        Change
                      </Button>
                    </div>

                    <div className="flex items-center justify-between">
                      <div>
                        <h3 className="font-medium text-gray-900">Two-Factor Authentication</h3>
                        <p className="text-sm text-gray-600">Add extra security to your account</p>
                      </div>
                      <Button variant="outline" className="border-purple-300 text-purple-700 bg-white/50 hover:bg-purple-50">
                        <Key className="h-4 w-4 mr-2" />
                        Setup
                      </Button>
                    </div>

                    <div className="flex items-center justify-between">
                      <div>
                        <h3 className="font-medium text-gray-900">Payment Methods</h3>
                        <p className="text-sm text-gray-600">Manage your payment options</p>
                      </div>
                      <Button variant="outline" className="border-purple-300 text-purple-700 bg-white/50 hover:bg-purple-50">
                        <CreditCard className="h-4 w-4 mr-2" />
                        Manage
                      </Button>
                    </div>
                  </div>

                  <div className="pt-4">
                    <h3 className="font-medium text-gray-900 mb-4">Danger Zone</h3>
                    <div className="flex justify-end">
                      <Button variant="destructive" className="bg-red-500/20 hover:bg-red-500/30 text-red-700">
                        Delete Account
                      </Button>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </TabsContent>

            <TabsContent value="notifications" className="space-y-6">
              <Card className="glass backdrop-blur-xl border-white/30 bg-gradient-to-br from-white/30 to-white/10">
                <CardHeader>
                  <CardTitle className="text-gray-900">Notification Preferences</CardTitle>
                  <CardDescription className="text-gray-700">
                    Choose how you receive notifications
                  </CardDescription>
                </CardHeader>
                <CardContent className="space-y-6">
                  <div className="space-y-4">
                    <div className="flex items-center justify-between">
                      <div>
                        <h3 className="font-medium text-gray-900">Email Notifications</h3>
                        <p className="text-sm text-gray-600">Receive notifications via email</p>
                      </div>
                      <label className="relative inline-flex items-center cursor-pointer">
                        <input
                          type="checkbox"
                          className="sr-only peer"
                          checked={userData.notifications.email}
                          onChange={(e) => handleInputChange('notifications', { ...userData.notifications, email: e.target.checked })}
                        />
                        <div className="w-11 h-6 bg-gray-300 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-purple-600"></div>
                      </label>
                    </div>

                    <div className="flex items-center justify-between">
                      <div>
                        <h3 className="font-medium text-gray-900">Push Notifications</h3>
                        <p className="text-sm text-gray-600">Receive push notifications on your devices</p>
                      </div>
                      <label className="relative inline-flex items-center cursor-pointer">
                        <input
                          type="checkbox"
                          className="sr-only peer"
                          checked={userData.notifications.push}
                          onChange={(e) => handleInputChange('notifications', { ...userData.notifications, push: e.target.checked })}
                        />
                        <div className="w-11 h-6 bg-gray-300 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after-top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-purple-600"></div>
                      </label>
                    </div>

                    <div className="flex items-center justify-between">
                      <div>
                        <h3 className="font-medium text-gray-900">SMS Notifications</h3>
                        <p className="text-sm text-gray-600">Receive notifications via SMS</p>
                      </div>
                      <label className="relative inline-flex items-center cursor-pointer">
                        <input
                          type="checkbox"
                          className="sr-only peer"
                          checked={userData.notifications.sms}
                          onChange={(e) => handleInputChange('notifications', { ...userData.notifications, sms: e.target.checked })}
                        />
                        <div className="w-11 h-6 bg-gray-300 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-purple-600"></div>
                      </label>
                    </div>
                  </div>

                  <div className="flex justify-end">
                    <Button onClick={handleSave} className="bg-gradient-to-r from-purple-600 via-pink-500 to-blue-500 hover:from-purple-700 hover:via-pink-600 hover:to-blue-600 text-white">
                      <Save className="h-4 w-4 mr-2" />
                      Save Preferences
                    </Button>
                  </div>
                </CardContent>
              </Card>
            </TabsContent>
          </Tabs>
        </motion.div>
      </div>
    </div>
  );
}