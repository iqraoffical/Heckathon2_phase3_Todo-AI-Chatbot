// app/tasks/page.tsx
'use client';

import React, { useState, useEffect } from 'react';
import { Task } from '../../lib/types';
import { taskApi } from '../../lib/api';
import TaskItem from '../../components/TaskItem';
import TaskForm from '../../components/TaskForm';

// Mock user ID - in a real app, this would come from authentication
const userId = '123e4567-e89b-12d3-a456-426614174000';

export default function TasksPage() {
  const [tasks, setTasks] = useState<Task[]>([]);
  const [loading, setLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);
  const [editingTask, setEditingTask] = useState<Task | null>(null);
  const [filter, setFilter] = useState<'all' | 'active' | 'completed'>('all');

  useEffect(() => {
    fetchTasks();
  }, [filter]);

  const fetchTasks = async () => {
    try {
      setLoading(true);
      const tasksData = await taskApi.getTasks(userId, {
        completed: filter === 'completed' ? true : filter === 'active' ? false : undefined
      });
      setTasks(tasksData);
    } catch (error) {
      console.error('Error fetching tasks:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleAddTask = async (taskData: Partial<Task>) => {
    try {
      const newTask = await taskApi.createTask(userId, taskData);
      setTasks([...tasks, newTask]);
      setShowForm(false);
    } catch (error) {
      console.error('Error adding task:', error);
    }
  };

  const handleUpdateTask = async (taskData: Partial<Task>) => {
    if (!editingTask) return;

    try {
      const updatedTask = await taskApi.updateTask(userId, editingTask.id, taskData);
      setTasks(tasks.map(t => t.id === editingTask.id ? updatedTask : t));
      setEditingTask(null);
      setShowForm(false);
    } catch (error) {
      console.error('Error updating task:', error);
    }
  };

  const handleToggleComplete = async (taskId: string) => {
    try {
      const taskToComplete = tasks.find(t => t.id === taskId);
      if (taskToComplete) {
        if (taskToComplete.completed) {
          // If task is already completed, we would need an update call to uncomplete it
          const updatedTask = await taskApi.updateTask(userId, taskId, { completed: false });
          setTasks(tasks.map(t => t.id === taskId ? updatedTask : t));
        } else {
          const completedTask = await taskApi.completeTask(userId, taskId);
          setTasks(tasks.map(t => t.id === taskId ? completedTask : t));
        }
      }
    } catch (error) {
      console.error('Error toggling task completion:', error);
    }
  };

  const handleDeleteTask = async (taskId: string) => {
    if (window.confirm('Are you sure you want to delete this task?')) {
      try {
        await taskApi.deleteTask(userId, taskId);
        setTasks(tasks.filter(t => t.id !== taskId));
      } catch (error) {
        console.error('Error deleting task:', error);
      }
    }
  };

  const handleEditTask = (task: Task) => {
    setEditingTask(task);
    setShowForm(true);
  };

  const handleFormSubmit = editingTask ? handleUpdateTask : handleAddTask;
  const formTitle = editingTask ? 'Edit Task' : 'Add New Task';

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500 mx-auto"></div>
          <p className="mt-4 text-gray-600">Loading tasks...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Navigation */}
      <nav className="bg-white shadow-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between h-16">
            <div className="flex items-center">
              <a href="/" className="flex-shrink-0 flex items-center">
                <span className="text-xl font-bold text-blue-600">Todo AI</span>
              </a>
            </div>
            <div className="hidden md:flex items-center space-x-8">
              <a href="/tasks" className="text-blue-600 font-medium border-b-2 border-blue-600">
                Tasks
              </a>
              <a href="/chat" className="text-gray-700 hover:text-blue-600 font-medium">
                Chat
              </a>
              <a href="/login" className="px-4 py-2 border border-transparent rounded-md text-base font-medium text-blue-700 bg-blue-100 hover:bg-blue-200">
                Sign in
              </a>
            </div>
          </div>
        </div>
      </nav>

      <div className="container mx-auto px-4 py-8">
        <div className="max-w-4xl mx-auto">
          <div className="bg-white rounded-xl shadow-md overflow-hidden">
            <div className="p-6 border-b border-gray-200">
              <div className="flex flex-col md:flex-row md:items-center md:justify-between">
                <h1 className="text-2xl font-bold text-gray-800 mb-4 md:mb-0">Your Tasks</h1>
                <div className="flex flex-col sm:flex-row gap-3">
                  <select
                    value={filter}
                    onChange={(e) => setFilter(e.target.value as 'all' | 'active' | 'completed')}
                    className="px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                  >
                    <option value="all">All Tasks</option>
                    <option value="active">Active</option>
                    <option value="completed">Completed</option>
                  </select>
                  <button
                    onClick={() => {
                      setEditingTask(null);
                      setShowForm(true);
                    }}
                    className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 flex items-center justify-center"
                  >
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-1" viewBox="0 0 20 20" fill="currentColor">
                      <path fillRule="evenodd" d="M10 5a1 1 0 011 1v3h3a1 1 0 110 2h-3v3a1 1 0 11-2 0v-3H6a1 1 0 110-2h3V6a1 1 0 011-1z" clipRule="evenodd" />
                    </svg>
                    Add Task
                  </button>
                </div>
              </div>
            </div>

            {showForm && (
              <div className="p-6 border-b border-gray-200 bg-blue-50">
                <h2 className="text-xl font-semibold text-gray-800 mb-4">{formTitle}</h2>
                <TaskForm
                  onSubmit={handleFormSubmit}
                  onCancel={() => {
                    setShowForm(false);
                    setEditingTask(null);
                  }}
                  initialData={editingTask || undefined}
                />
              </div>
            )}

            <div className="p-6">
              {tasks.length === 0 ? (
                <div className="text-center py-12">
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-16 w-16 mx-auto text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
                  </svg>
                  <h3 className="mt-4 text-lg font-medium text-gray-900">No tasks found</h3>
                  <p className="mt-1 text-gray-500">Get started by creating a new task.</p>
                  <div className="mt-6">
                    <button
                      onClick={() => {
                        setEditingTask(null);
                        setShowForm(true);
                      }}
                      className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
                    >
                      Create your first task
                    </button>
                  </div>
                </div>
              ) : (
                <div className="space-y-4">
                  {tasks.map(task => (
                    <TaskItem
                      key={task.id}
                      task={task}
                      onToggleComplete={handleToggleComplete}
                      onDelete={handleDeleteTask}
                      onEdit={handleEditTask}
                    />
                  ))}
                </div>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* Footer */}
      <footer className="bg-gray-800 text-white py-8 mt-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <p className="text-gray-400">
            &copy; {new Date().getFullYear()} Todo AI Chatbot. All rights reserved.
          </p>
        </div>
      </footer>
    </div>
  );
}