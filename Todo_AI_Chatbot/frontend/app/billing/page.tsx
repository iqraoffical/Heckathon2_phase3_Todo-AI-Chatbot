'use client';

import { useState } from 'react';
import { motion } from 'framer-motion';
import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Separator } from '@/components/ui/separator';
import {
  CreditCard,
  Package,
  Receipt,
  Calendar,
  Check,
  AlertTriangle,
  ExternalLink,
  Download
} from 'lucide-react';

export default function BillingPage() {
  const [activeTab, setActiveTab] = useState('overview');

  // Mock data for billing information
  const currentPlan = {
    name: 'Pro Plan',
    price: '$19.99',
    period: 'per month',
    features: [
      'Unlimited tasks',
      'Advanced analytics',
      'Priority support',
      'Custom integrations',
      'Up to 10 team members'
    ]
  };

  const paymentMethods = [
    { id: '1', type: 'Visa', lastFour: '4242', expiry: '12/25', isDefault: true },
    { id: '2', type: 'Mastercard', lastFour: '5678', expiry: '08/26', isDefault: false }
  ];

  const invoices = [
    { id: '#INV-001', date: '2023-10-15', amount: '$19.99', status: 'Paid' },
    { id: '#INV-002', date: '2023-09-15', amount: '$19.99', status: 'Paid' },
    { id: '#INV-003', date: '2023-08-15', amount: '$19.99', status: 'Paid' }
  ];

  return (
    <div className="pt-32 p-4 md:p-8 bg-gradient-to-br from-gray-900 via-indigo-900/70 to-purple-900 min-h-[calc(100vh-200px)]"> {/* Updated to match new color scheme */}
      <div className="max-w-6xl mx-auto">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="mb-8"
        >
          <h1 className="text-3xl md:text-4xl font-bold bg-gradient-to-r from-purple-400 via-indigo-400 to-cyan-400 bg-clip-text text-transparent">
            Billing & Subscription
          </h1>
          <p className="text-purple-200 mt-2">Manage your subscription and payment methods</p>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
        >
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            {/* Left Column - Current Plan */}
            <div className="lg:col-span-2 space-y-6">
              <Card className="glass backdrop-blur-xl border-white/30 bg-gradient-to-br from-white/30 to-white/10">
                <CardHeader>
                  <div className="flex items-center justify-between">
                    <div>
                      <CardTitle className="text-gray-900 flex items-center">
                        <Package className="h-5 w-5 mr-2" />
                        Current Plan
                      </CardTitle>
                      <CardDescription className="text-gray-700">
                        Your active subscription
                      </CardDescription>
                    </div>
                    <Badge variant="secondary" className="bg-gradient-to-r from-purple-500/20 to-indigo-500/20 text-purple-700">
                      Active
                    </Badge>
                  </div>
                </CardHeader>
                <CardContent>
                  <div className="flex flex-col md:flex-row md:items-center md:justify-between">
                    <div>
                      <h3 className="text-2xl font-bold text-gray-900">{currentPlan.name}</h3>
                      <p className="text-gray-700">
                        <span className="text-3xl font-bold">{currentPlan.price}</span> {currentPlan.period}
                      </p>
                    </div>
                    <div className="mt-4 md:mt-0">
                      <Button className="bg-gradient-to-r from-purple-600 via-indigo-600 to-cyan-600 hover:from-purple-700 hover:via-indigo-700 hover:to-cyan-700 text-white">
                        Upgrade Plan
                      </Button>
                    </div>
                  </div>

                  <Separator className="my-6" />

                  <h4 className="font-medium text-gray-900 mb-4">Plan Features</h4>
                  <ul className="space-y-2">
                    {currentPlan.features.map((feature, index) => (
                      <li key={index} className="flex items-center">
                        <Check className="h-4 w-4 text-green-500 mr-2" />
                        <span className="text-gray-700">{feature}</span>
                      </li>
                    ))}
                  </ul>

                  <Separator className="my-6" />

                  <div className="flex items-center text-sm text-yellow-600 bg-yellow-500/10 p-3 rounded-lg">
                    <AlertTriangle className="h-4 w-4 mr-2" />
                    <span>Your next billing date is December 15, 2023</span>
                  </div>
                </CardContent>
              </Card>

              {/* Payment Methods */}
              <Card className="glass backdrop-blur-xl border-white/30 bg-gradient-to-br from-white/30 to-white/10">
                <CardHeader>
                  <CardTitle className="text-gray-900 flex items-center">
                    <CreditCard className="h-5 w-5 mr-2" />
                    Payment Methods
                  </CardTitle>
                  <CardDescription className="text-gray-700">
                    Manage your saved payment methods
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    {paymentMethods.map((method) => (
                      <div key={method.id} className="flex items-center justify-between p-4 border border-white/30 rounded-lg bg-white/20">
                        <div className="flex items-center">
                          <div className="bg-gray-200 border-2 border-dashed rounded-xl w-16 h-10 flex items-center justify-center mr-4">
                            <span className="text-xs font-medium text-gray-600">{method.type}</span>
                          </div>
                          <div>
                            <p className="font-medium text-gray-900">{method.type} ending in {method.lastFour}</p>
                            <p className="text-sm text-gray-600">Expires {method.expiry}</p>
                          </div>
                        </div>
                        <div className="flex items-center space-x-2">
                          {method.isDefault && (
                            <Badge variant="secondary" className="bg-gradient-to-r from-purple-500/20 to-indigo-500/20 text-purple-700">
                              Default
                            </Badge>
                          )}
                          <Button variant="outline" size="sm" className="border-purple-300 text-purple-700 bg-white/50 hover:bg-purple-50">
                            Edit
                          </Button>
                        </div>
                      </div>
                    ))}
                  </div>
                  <Button variant="outline" className="mt-4 w-full border-purple-300 text-purple-700 bg-white/50 hover:bg-purple-50">
                    <CreditCard className="h-4 w-4 mr-2" />
                    Add Payment Method
                  </Button>
                </CardContent>
              </Card>
            </div>

            {/* Right Column - Invoices */}
            <div>
              <Card className="glass backdrop-blur-xl border-white/30 bg-gradient-to-br from-white/30 to-white/10">
                <CardHeader>
                  <CardTitle className="text-gray-900 flex items-center">
                    <Receipt className="h-5 w-5 mr-2" />
                    Recent Invoices
                  </CardTitle>
                  <CardDescription className="text-gray-700">
                    View and download your past invoices
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    {invoices.map((invoice) => (
                      <div key={invoice.id} className="flex items-center justify-between p-3 border border-white/30 rounded-lg bg-white/20">
                        <div>
                          <p className="font-medium text-gray-900">{invoice.id}</p>
                          <p className="text-sm text-gray-600">{invoice.date}</p>
                        </div>
                        <div className="text-right">
                          <p className="font-medium text-gray-900">{invoice.amount}</p>
                          <Badge variant={invoice.status === 'Paid' ? 'default' : 'secondary'} 
                                className={invoice.status === 'Paid' 
                                  ? 'bg-gradient-to-r from-green-500/20 to-emerald-500/20 text-green-700' 
                                  : 'bg-gradient-to-r from-yellow-500/20 to-amber-500/20 text-yellow-700'}>
                            {invoice.status}
                          </Badge>
                        </div>
                        <Button variant="ghost" size="icon" className="text-gray-600 hover:text-purple-600">
                          <Download className="h-4 w-4" />
                        </Button>
                      </div>
                    ))}
                  </div>
                  <Button variant="outline" className="mt-4 w-full border-purple-300 text-purple-700 bg-white/50 hover:bg-purple-50">
                    View All Invoices
                  </Button>
                </CardContent>
              </Card>

              {/* Billing History */}
              <Card className="glass backdrop-blur-xl border-white/30 bg-gradient-to-br from-white/30 to-white/10 mt-6">
                <CardHeader>
                  <CardTitle className="text-gray-900 flex items-center">
                    <Calendar className="h-5 w-5 mr-2" />
                    Billing History
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="text-center py-6">
                    <div className="mx-auto bg-gradient-to-r from-purple-500 to-indigo-500 p-3 rounded-full w-12 h-12 flex items-center justify-center inline-block">
                      <Calendar className="h-6 w-6 text-white" />
                    </div>
                    <h3 className="mt-4 text-lg font-medium text-gray-900">No billing history</h3>
                    <p className="mt-2 text-sm text-gray-600">Your billing history will appear here.</p>
                  </div>
                </CardContent>
              </Card>
            </div>
          </div>
        </motion.div>
      </div>
    </div>
  );
}