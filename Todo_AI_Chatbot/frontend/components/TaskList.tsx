'use client';

import { useState, useEffect, useImperativeHandle, forwardRef, ForwardedRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import TaskCard from './TaskCard';
import TaskModal from './TaskModal';
import { apiClient } from '@/lib/api';
import LoadingSpinner from '@/components/ui/loading-spinner';

// Fixed: Changed status to use backend format consistently ('in_progress' instead of 'in-progress')
interface Task {
  id: string;
  title: string;
  description?: string;
  status: 'todo' | 'in_progress' | 'completed'; // Using backend format consistently
  priority: 'low' | 'medium' | 'high';
  dueDate?: string;
  tags: string[]; // Tags are now an array of strings
  category?: string;
  estimatedTime?: number; // Estimated time in minutes
  actualTimeSpent?: number; // Actual time spent in minutes
  projectId?: string;
  completed: boolean;
  createdAt: string;
}

export interface TaskListProps {
  searchParams: { [key: string]: string | string[] | undefined };
}

export interface TaskListRef {
  refetch: () => void;
}

// Fixed: Corrected forwardRef typing to properly return JSX.Element
const TaskList = forwardRef<TaskListRef, TaskListProps>(({ searchParams }, ref) => {
  const [tasks, setTasks] = useState<Task[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingTask, setEditingTask] = useState<any>(null);

  // Extract filters from URL params
  const search = typeof searchParams.search === 'string' ? searchParams.search : '';
  const status = typeof searchParams.status === 'string' ? searchParams.status : '';
  const priority = typeof searchParams.priority === 'string' ? searchParams.priority : '';
  const tags = typeof searchParams.tags === 'string' ? searchParams.tags : ''; // Extract tags from URL params
  const dueDateFrom = typeof searchParams.due_date_from === 'string' ? searchParams.due_date_from : ''; // Extract due date from from URL params
  const dueDateTo = typeof searchParams.due_date_to === 'string' ? searchParams.due_date_to : ''; // Extract due date to from URL params
  const sortBy = typeof searchParams.sort_by === 'string' ? searchParams.sort_by : 'createdAt';
  const order = typeof searchParams.order === 'string' ? searchParams.order : 'desc';

  // Fixed: Moved refetch function declaration before useImperativeHandle
  const refetch = async () => {
    try {
      setLoading(true);

      // Prepare filters object
      const filters: Record<string, string> = {};
      if (search) filters.search = search;
      if (status) {
        // Map frontend status to backend status
        if (status === 'in-progress') {
          filters.status = 'in_progress';
        } else {
          filters.status = status;
        }
      }
      if (priority) filters.priority = priority;
      if (tags) filters.tags = tags; // Add tags filter
      if (dueDateFrom) filters.due_date_from = dueDateFrom; // Add due date from filter
      if (dueDateTo) filters.due_date_to = dueDateTo; // Add due date to filter
      if (sortBy) filters.sort_by = sortBy;  // Note: API expects sort_by, not sortBy
      if (order) filters.order = order;

      // Fixed: Using apiClient.getTasks() instead of apiClient.get()
      const tasksData = await apiClient.getTasks(filters);
      setTasks(tasksData.map(task => ({
        id: task.id,
        title: task.title,
        description: task.description,
        status: task.status, // Using backend format consistently
        priority: task.priority,
        dueDate: task.due_date,
        tags: task.tags,
        category: task.category,
        estimatedTime: task.estimated_time,
        actualTimeSpent: task.actual_time_spent,
        projectId: task.project_id,
        completed: task.status === 'completed',
        createdAt: task.created_at
      })));
      setError(null);
    } catch (err) {
      console.error('Error fetching tasks:', err);
      setError('Failed to load tasks. Please try again later.');
      setTasks([]);
    } finally {
      setLoading(false);
    }
  };

  // Fixed: useImperativeHandle now references refetch which is declared above
  useImperativeHandle(ref, () => ({
    refetch
  }));

  useEffect(() => {
    const fetchTasks = async () => {
      try {
        setLoading(true);

        // Prepare filters object
        const filters: Record<string, string> = {};
        if (search) filters.search = search;
        if (status) {
          // Map frontend status to backend status
          if (status === 'in-progress') {
            filters.status = 'in_progress';
          } else {
            filters.status = status;
          }
        }
        if (priority) filters.priority = priority;
        if (tags) filters.tags = tags; // Add tags filter
        if (sortBy) filters.sort_by = sortBy;  // Note: API expects sort_by, not sortBy
        if (order) filters.order = order;

        // Fixed: Using apiClient.getTasks() instead of apiClient.get()
        const tasksData = await apiClient.getTasks(filters);
        setTasks(tasksData.map(task => ({
          id: task.id,
          title: task.title,
          description: task.description,
          status: task.status, // Using backend format consistently
          priority: task.priority,
          dueDate: task.due_date,
          tags: task.tags,
          completed: task.status === 'completed',
          createdAt: task.created_at
        })));
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
  }, [search, status, priority, tags, dueDateFrom, dueDateTo, sortBy, order]); // Add tags and date filters to dependency array

  const handleStatusChange = async (taskId: string, newStatus: 'todo' | 'in_progress' | 'completed') => {
    try {
      // Optimistically update the UI
      setTasks(prevTasks =>
        prevTasks.map(task =>
          task.id === taskId
            ? { ...task, status: newStatus, completed: newStatus === 'completed' }
            : task
        )
      );

      // Fixed: Using apiClient.updateTask() instead of apiClient.patch()
      await apiClient.updateTask(taskId, { status: newStatus });
    } catch (err) {
      console.error('Error updating task status:', err);
      // Revert the optimistic update if the API call fails
      const originalTask = tasks.find(task => task.id === taskId);
      if (originalTask) {
        setTasks(prevTasks =>
          prevTasks.map(task =>
            task.id === taskId ? originalTask : task
          )
        );
      }
    }
  };

  const handleCompleteToggle = async (taskId: string, completed: boolean) => {
    try {
      // Find the task to determine its current status
      const task = tasks.find(t => t.id === taskId);
      if (!task) return;

      // Determine the new status based on completion state
      const newStatus = completed ? 'completed' : 'todo';

      // Optimistically update the UI
      setTasks(prevTasks =>
        prevTasks.map(t =>
          t.id === taskId
            ? { ...t, completed, status: newStatus }
            : t
        )
      );

      // Fixed: Using apiClient.updateTask() instead of apiClient.patch()
      await apiClient.updateTask(taskId, { status: newStatus });
    } catch (err) {
      console.error('Error updating task completion:', err);
      // Revert the optimistic update if the API call fails
      const originalTask = tasks.find(task => task.id === taskId);
      if (originalTask) {
        setTasks(prevTasks =>
          prevTasks.map(task =>
            task.id === taskId ? originalTask : task
          )
        );
      }
    }
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center h-64">
        <LoadingSpinner size="md" />
      </div>
    );
  }

  if (error) {
    return (
      <motion.div
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        className="glass backdrop-blur-xl border border-red-500/30 p-4 rounded-lg"
      >
        <div className="flex items-center">
          <div className="flex-shrink-0">
            <svg className="h-5 w-5 text-red-400" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor">
              <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7 4a1 1 0 11-2 0 1 1 0 012 0zm-1-9a1 1 0 00-1 1v4a1 1 0 102 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
            </svg>
          </div>
          <div className="ml-3">
            <p className="text-sm text-red-300">{error}</p>
          </div>
        </div>
      </motion.div>
    );
  }

  if (tasks.length === 0) {
    return (
      <motion.div
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        className="text-center py-12"
      >
        <div className="mx-auto bg-gradient-to-r from-purple-500 to-blue-500 p-3 rounded-full w-16 h-16 flex items-center justify-center inline-block">
          <svg className="h-8 w-8 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
          </svg>
        </div>
        <h3 className="mt-4 text-lg font-medium text-white">No tasks yet</h3>
        <p className="mt-2 text-sm text-white/70">Get started by creating a new task.</p>
      </motion.div>
    );
  }

  const handleDeleteTask = (taskId: string) => {
    setTasks(prevTasks => prevTasks.filter(task => task.id !== taskId));
  };

  const handleEditTask = (taskData: any) => {
    setEditingTask(taskData);
    setIsModalOpen(true);
  };

  const handleModalClose = () => {
    setIsModalOpen(false);
    setEditingTask(null);
  };

  const handleModalSuccess = () => {
    // Refresh the task list after successful edit
    refetch();
    handleModalClose();
  };

  return (
    <>
      <AnimatePresence>
        <div className="space-y-4">
          {tasks.map((task) => (
            <TaskCard
              key={task.id}
              id={task.id}
              title={task.title}
              description={task.description}
              status={task.status}
              priority={task.priority}
              dueDate={task.dueDate}
              tags={task.tags}
              category={task.category}
              estimatedTime={task.estimatedTime}
              actualTimeSpent={task.actualTimeSpent}
              projectId={task.projectId}
              completed={task.completed}
              onStatusChange={handleStatusChange}
              onCompleteToggle={handleCompleteToggle}
              onTaskDelete={handleDeleteTask}
              onTaskEdit={handleEditTask}
            />
          ))}
        </div>
      </AnimatePresence>

      <TaskModal
        isOpen={isModalOpen}
        onClose={handleModalClose}
        task={editingTask}
        onSuccess={handleModalSuccess}
      />
    </>
  );
});

// Fixed: Properly export the component with forwardRef typing
export default TaskList;