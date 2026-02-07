'use client';

import { useState } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { motion } from 'framer-motion';
import { 
  LayoutDashboard, 
  Plus, 
  Calendar, 
  Flag, 
  CheckCircle, 
  Circle, 
  Clock, 
  BarChart3, 
  Target,
  Menu,
  X
} from 'lucide-react';

const Sidebar = () => {
  const [isOpen, setIsOpen] = useState(false);
  const pathname = usePathname();

  const navItems = [
    { name: 'Dashboard', href: '/tasks', icon: LayoutDashboard },
    { name: 'Projects', href: '/projects', icon: BarChart3 },
    { name: 'Add Task', href: '/tasks?add=true', icon: Plus },
    { name: 'Calendar', href: '/tasks?view=calendar', icon: Calendar },
    { name: 'All Tasks', href: '/tasks?status=all', icon: BarChart3 },
    { name: 'Pending', href: '/tasks?status=pending', icon: Clock },
    { name: 'Completed', href: '/tasks?status=completed', icon: CheckCircle },
    { name: 'High Priority', href: '/tasks?priority=high', icon: Target },
  ];

  return (
    <>
      {/* Mobile menu button */}
      <button
        className="md:hidden fixed top-24 left-4 z-50 p-2 rounded-md glass backdrop-blur-xl border border-yellow-500/30 bg-gradient-to-br from-black/30 to-black/10 text-white"
        onClick={() => setIsOpen(true)}
      >
        <Menu className="h-5 w-5" />
      </button>

      {/* Sidebar overlay for mobile */}
      {isOpen && (
        <div
          className="fixed inset-0 z-40 bg-black/50 md:hidden"
          onClick={() => setIsOpen(false)}
        />
      )}

      {/* Sidebar */}
      <motion.aside
        className={`fixed top-16 left-0 h-[calc(100vh-4rem)] w-64 z-50 glass backdrop-blur-xl border-r border-yellow-500/30 bg-gradient-to-b from-black/30 to-black/10 transform ${
          isOpen ? 'translate-x-0' : '-translate-x-full'
        } md:translate-x-0 transition-transform duration-300 ease-in-out`}
        initial={{ x: -256 }}
        animate={{ x: isOpen || window.innerWidth >= 768 ? 0 : -256 }}
        transition={{ type: 'spring', damping: 20 }}
      >
        <div className="p-4">
          <div className="flex items-center justify-between md:hidden">
            <h2 className="text-xl font-bold bg-gradient-to-r from-yellow-500 via-yellow-600 to-yellow-700 bg-clip-text text-transparent">
              Menu
            </h2>
            <button
              className="p-1 rounded-md glass backdrop-blur-xl border border-yellow-500/30 bg-gradient-to-br from-black/30 to-black/10 text-white"
              onClick={() => setIsOpen(false)}
            >
              <X className="h-5 w-5" />
            </button>
          </div>

          <nav className="mt-8">
            <ul className="space-y-2">
              {navItems.map((item) => {
                const Icon = item.icon;
                const isActive = pathname === item.href ||
                  (item.href.includes('?') && pathname.startsWith(item.href.split('?')[0]));

                return (
                  <li key={item.name}>
                    <Link
                      href={item.href}
                      className={`flex items-center px-4 py-3 rounded-lg text-sm font-medium transition-colors ${
                        isActive
                          ? 'bg-gradient-to-r from-yellow-500/20 to-yellow-600/20 text-yellow-400'
                          : 'text-white hover:bg-yellow-500/10'
                      }`}
                      onClick={() => setIsOpen(false)} // Close sidebar on mobile after click
                    >
                      <Icon className="h-5 w-5 mr-3 text-yellow-400" />
                      {item.name}
                    </Link>
                  </li>
                );
              })}
            </ul>
          </nav>
        </div>
      </motion.aside>
    </>
  );
};

export default Sidebar;