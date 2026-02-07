'use client';

import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Search, Plus, Filter, Calendar, Flag, CheckCircle, Circle, Clock, BarChart3, Target } from 'lucide-react';
import { Task } from '@/lib/api';
import { apiClient } from '@/lib/api';
import TaskList from '@/components/TaskList';
import TaskFilters from '@/components/TaskFilters';
import Sidebar from '@/components/Sidebar';

export default function TasksPage({
  searchParams
}: {
  searchParams: { [key: string]: string | string[] | undefined };
}) {
  const [tasks, setTasks] = useState<Task[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Extract filters from URL params
  const search = typeof searchParams.search === 'string' ? searchParams.search : '';
  const status = typeof searchParams.status === 'string' ? searchParams.status : '';
  const priority = typeof searchParams.priority === 'string' ? searchParams.priority : '';
  const category = typeof searchParams.category === 'string' ? searchParams.category : '';
  const projectId = typeof searchParams.project_id === 'string' ? searchParams.project_id : '';
  const tags = typeof searchParams.tags === 'string' ? searchParams.tags : ''; // Extract tags from URL params
  const dueDateFrom = typeof searchParams.due_date_from === 'string' ? searchParams.due_date_from : ''; // Extract due date from from URL params
  const dueDateTo = typeof searchParams.due_date_to === 'string' ? searchParams.due_date_to : ''; // Extract due date to from URL params

  useEffect(() => {
    const fetchTasks = async () => {
      try {
        setLoading(true);

        // Prepare filters object
        const filters: Record<string, string> = {};
        if (search) filters.search = search;
        if (status) filters.status = status;
        if (priority) filters.priority = priority;
        if (category) filters.category = category;
        if (projectId) filters.project_id = projectId;
        if (tags) filters.tags = tags; // Add tags filter
        if (dueDateFrom) filters.due_date_from = dueDateFrom; // Add due date from filter
        if (dueDateTo) filters.due_date_to = dueDateTo; // Add due date to filter

        const tasksData = await apiClient.getTasks(filters);
        setTasks(tasksData);
        setError(null);
      } catch (err) {
        console.error('Error fetching tasks:', err);
        setError('Failed to load tasks. Please try again later.');
        setTasks([]);
      } finally {
        setLoading(false);
      }
    };

    fetchTasks();
  }, [search, status, priority, category, projectId, tags, dueDateFrom, dueDateTo]); // Add tags and date filters to dependency array

  // Stats calculation
  const totalTasks = tasks.length;
  const completedTasks = tasks.filter(task => task.status === 'completed').length;
  const pendingTasks = totalTasks - completedTasks;
  const highPriorityTasks = tasks.filter(task => task.priority === 'high').length;

  return (
    <div className="pt-32 p-4 md:p-8 bg-gradient-to-br from-black via-gray-900 to-black min-h-[calc(100vh-200px)]">
      <div className="flex">
        <Sidebar />
        <div className="flex-1 md:ml-64">
          <div className="max-w-7xl mx-auto">
            {/* Header */}
            <motion.div
              initial={{ opacity: 0, y: -20 }}
              animate={{ opacity: 1, y: 0 }}
              className="mb-8"
            >
              <h1 className="text-3xl md:text-4xl font-bold bg-gradient-to-r from-yellow-500 via-yellow-600 to-yellow-700 bg-clip-text text-transparent font-extrabold">
                My Tasks
              </h1>
              <p className="text-white mt-2 font-medium">Manage your tasks efficiently</p>
            </motion.div>

            {/* Stats Cards */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.1 }}
              className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8"
            >
              <Card className="glass backdrop-blur-xl border-yellow-500/30 bg-gradient-to-br from-black/30 to-black/10">
                <CardHeader className="flex flex-row items-center justify-between pb-2">
                  <CardTitle className="text-sm font-medium text-white text-high-contrast">Total Tasks</CardTitle>
                  <div className="p-2 bg-gradient-to-r from-yellow-500/20 to-yellow-600/20 rounded-lg">
                    <BarChart3 className="h-5 w-5 text-white" />
                  </div>
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold text-white text-high-contrast">{totalTasks}</div>
                </CardContent>
              </Card>

              <Card className="glass backdrop-blur-xl border-yellow-500/30 bg-gradient-to-br from-black/30 to-black/10">
                <CardHeader className="flex flex-row items-center justify-between pb-2">
                  <CardTitle className="text-sm font-medium text-white text-high-contrast">Completed</CardTitle>
                  <div className="p-2 bg-gradient-to-r from-yellow-500/20 to-yellow-600/20 rounded-lg">
                    <CheckCircle className="h-5 w-5 text-white" />
                  </div>
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold text-white text-high-contrast">{completedTasks}</div>
                </CardContent>
              </Card>

              <Card className="glass backdrop-blur-xl border-yellow-500/30 bg-gradient-to-br from-black/30 to-black/10">
                <CardHeader className="flex flex-row items-center justify-between pb-2">
                  <CardTitle className="text-sm font-medium text-white text-high-contrast">Pending</CardTitle>
                  <div className="p-2 bg-gradient-to-r from-yellow-500/20 to-yellow-600/20 rounded-lg">
                    <Clock className="h-5 w-5 text-white" />
                  </div>
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold text-white text-high-contrast">{pendingTasks}</div>
                </CardContent>
              </Card>

              <Card className="glass backdrop-blur-xl border-yellow-500/30 bg-gradient-to-br from-black/30 to-black/10">
                <CardHeader className="flex flex-row items-center justify-between pb-2">
                  <CardTitle className="text-sm font-medium text-white text-high-contrast">High Priority</CardTitle>
                  <div className="p-2 bg-gradient-to-r from-yellow-500/20 to-yellow-600/20 rounded-lg">
                    <Target className="h-5 w-5 text-white" />
                  </div>
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold text-white text-high-contrast">{highPriorityTasks}</div>
                </CardContent>
              </Card>
            </motion.div>

            {/* Filters and Search */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2 }}
              className="mb-8"
            >
              <TaskFilters />
            </motion.div>

            {/* Task List */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.3 }}
            >
              <Card className="glass backdrop-blur-xl border-yellow-500/30 bg-gradient-to-br from-black/30 to-black/10">
                <CardHeader>
                  <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
                    <CardTitle className="text-white text-high-contrast font-bold">Your Tasks</CardTitle>
                    <div className="flex flex-wrap gap-2">
                      <Button className="bg-gradient-to-r from-yellow-500 to-yellow-600 hover:from-yellow-600 hover:to-yellow-700 text-black">
                        <Plus className="h-4 w-4 mr-2" />
                        Add Task
                      </Button>
                    </div>
                  </div>
                </CardHeader>
                <CardContent>
                  <TaskList searchParams={searchParams} />
                </CardContent>
              </Card>
            </motion.div>
          </div>
        </div>
      </div>
    </div>
  );
}

// Clipboard icon component since it's not in lucide-react
function ClipboardIcon({ className }: { className?: string }) {
  return (
    <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={className}>
      <rect width="8" height="4" x="8" y="2" rx="1" ry="1"/>
      <path d="M16 4h2a2 2 0 0 1 2 2v14a2 2 0 0 1-2 2H6a2 2 0 0 1-2-2V6a2 2 0 0 1 2-2h2"/>
    </svg>
  );
}