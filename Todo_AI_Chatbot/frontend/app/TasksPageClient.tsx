'use client';

import { useState, useRef, useEffect } from 'react';
import { useSession } from '../lib/auth-client';
import dynamic from 'next/dynamic';
import { TaskListProps } from '@/components/TaskList';

// Dynamically import TaskList with no SSR to prevent hydration issues
const DynamicTaskList = dynamic<TaskListProps>(() => import('@/components/TaskList'), {
  ssr: false,
  loading: () => <div className="text-center py-12">Loading tasks...</div>
});

interface Task {
  id: string;
  title: string;
  description?: string;
  status: 'todo' | 'in_progress' | 'completed';
  priority: 'low' | 'medium' | 'high';
  due_date?: string;
  tags?: string[];
  user_id: string;
  created_at: string;
  updated_at: string;
}

export default function TasksPageClient({
  searchParams
}: {
  searchParams: { [key: string]: string | string[] | undefined };
}) {
  const { data: session, isLoading } = useSession();
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isMounted, setIsMounted] = useState(false);
  
  // Track if component is mounted to prevent SSR/client mismatch
  useEffect(() => {
    setIsMounted(true);
  }, []);

  // Show nothing during SSR/hydration
  if (!isMounted) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-gray-900 via-indigo-900/70 to-purple-900 py-8 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-purple-500 mx-auto"></div>
          <p className="mt-4 text-purple-300">Loading...</p>
        </div>
      </div>
    );
  }

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-gray-900 via-indigo-900/70 to-purple-900 py-8 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-purple-500 mx-auto"></div>
          <p className="mt-4 text-purple-300">Loading...</p>
        </div>
      </div>
    );
  }

  if (!session) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-gray-900 via-indigo-900/70 to-purple-900 py-8 flex items-center justify-center">
        <div className="text-center">
          <h1 className="text-2xl font-bold text-white">Access Denied</h1>
          <p className="mt-2 text-purple-300">Please sign in to view your tasks.</p>
          <a
            href="/signin"
            className="mt-4 inline-block px-4 py-2 bg-gradient-to-r from-purple-600 to-indigo-600 text-white rounded-md hover:from-purple-700 hover:to-indigo-700"
          >
            Sign In
          </a>
        </div>
      </div>
    );
  }

  const handleCreateTask = async (taskData: Omit<Task, 'id' | 'user_id' | 'created_at' | 'updated_at'>) => {
    try {
      // This would normally call the createTask API function
      console.log('Creating task:', taskData);
      setIsModalOpen(false);
    } catch (error) {
      console.error('Error creating task:', error);
      alert('Failed to create task. Please try again.');
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 via-indigo-900/70 to-purple-900 py-8">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between mb-8">
          <div className="mb-4 sm:mb-0">
            <h1 className="text-3xl font-bold text-white">Your Tasks</h1>
            <p className="mt-2 text-gray-300">Manage your tasks efficiently</p>
          </div>
          <button
            onClick={() => setIsModalOpen(true)}
            className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-gradient-to-r from-purple-600 to-blue-600 hover:from-purple-700 hover:to-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-purple-500"
          >
            Add New Task
          </button>
        </div>

        {/* Task List */}
        <DynamicTaskList searchParams={searchParams} />

        {/* Add Task Modal - Simplified for this example */}
        {isModalOpen && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
            <div className="glass backdrop-blur-xl border border-white/30 bg-gradient-to-br from-white/30 to-white/10 rounded-lg shadow-xl w-full max-w-md">
              <div className="p-6">
                <h3 className="text-lg font-medium text-white mb-4">Add New Task</h3>
                <p className="text-gray-300">Task creation form would go here</p>
                <div className="mt-6 flex justify-end space-x-3">
                  <button
                    onClick={() => setIsModalOpen(false)}
                    className="inline-flex items-center px-4 py-2 border border-purple-500 text-sm font-medium rounded-md shadow-sm text-purple-300 bg-transparent hover:bg-purple-900/30 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-purple-500"
                  >
                    Cancel
                  </button>
                  <button
                    onClick={() => setIsModalOpen(false)}
                    className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-gradient-to-r from-purple-600 to-blue-600 hover:from-purple-700 hover:to-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-purple-500"
                  >
                    Create Task
                  </button>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}