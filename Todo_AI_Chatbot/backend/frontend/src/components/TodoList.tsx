'use client';

import React, { useState, useEffect } from 'react';
import { Task } from '@/types/task';

// Define types
type TaskStatus = 'todo' | 'in_progress' | 'completed';
type TaskPriority = 'low' | 'medium' | 'high';

interface TodoListProps {
  initialTasks?: Task[];
}

const TodoList: React.FC<TodoListProps> = ({ initialTasks = [] }) => {
  const [tasks, setTasks] = useState<Task[]>(initialTasks);
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [status, setStatus] = useState<TaskStatus>('todo');
  const [priority, setPriority] = useState<TaskPriority>('medium');
  const [dueDate, setDueDate] = useState<string>('');
  const [tags, setTags] = useState<string>('');
  const [editingTaskId, setEditingTaskId] = useState<string | null>(null);
  const [filter, setFilter] = useState<'all' | 'active' | 'completed'>('all');
  const [searchTerm, setSearchTerm] = useState('');

  // Load tasks from API on component mount
  useEffect(() => {
    const fetchTasks = async () => {
      try {
        const response = await fetch(`${process.env.NEXT_PUBLIC_API_BASE_URL}/api/tasks`, {
          headers: {
            'Authorization': `Bearer ${localStorage.getItem('authToken')}`,
            'Content-Type': 'application/json',
          },
        });
        
        if (response.ok) {
          const data = await response.json();
          setTasks(data);
        } else {
          console.error('Failed to fetch tasks');
        }
      } catch (error) {
        console.error('Error fetching tasks:', error);
      }
    };

    fetchTasks();
  }, []);

  // Filter tasks based on filter and search term
  const filteredTasks = tasks.filter(task => {
    const matchesFilter = filter === 'all' || 
                         (filter === 'active' && task.status !== 'completed') || 
                         (filter === 'completed' && task.status === 'completed');
    
    const matchesSearch = task.title.toLowerCase().includes(searchTerm.toLowerCase()) || 
                          task.description?.toLowerCase().includes(searchTerm.toLowerCase());
    
    return matchesFilter && matchesSearch;
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    const newTask: Omit<Task, 'id' | 'created_at' | 'updated_at' | 'user_id'> = {
      title,
      description,
      status,
      priority,
      due_date: dueDate ? new Date(dueDate).toISOString() : null,
      tags: tags.split(',').map(tag => tag.trim()).filter(tag => tag),
    };

    try {
      if (editingTaskId) {
        // Update existing task
        const response = await fetch(`${process.env.NEXT_PUBLIC_API_BASE_URL}/api/tasks/${editingTaskId}`, {
          method: 'PUT',
          headers: {
            'Authorization': `Bearer ${localStorage.getItem('authToken')}`,
            'Content-Type': 'application/json',
          },
          body: JSON.stringify(newTask),
        });

        if (response.ok) {
          const updatedTask = await response.json();
          setTasks(tasks.map(task => task.id === editingTaskId ? updatedTask : task));
          setEditingTaskId(null);
        } else {
          console.error('Failed to update task');
        }
      } else {
        // Create new task
        const response = await fetch(`${process.env.NEXT_PUBLIC_API_BASE_URL}/api/tasks`, {
          method: 'POST',
          headers: {
            'Authorization': `Bearer ${localStorage.getItem('authToken')}`,
            'Content-Type': 'application/json',
          },
          body: JSON.stringify(newTask),
        });

        if (response.ok) {
          const createdTask = await response.json();
          setTasks([...tasks, createdTask]);
        } else {
          console.error('Failed to create task');
        }
      }

      // Reset form
      resetForm();
    } catch (error) {
      console.error('Error saving task:', error);
    }
  };

  const resetForm = () => {
    setTitle('');
    setDescription('');
    setStatus('todo');
    setPriority('medium');
    setDueDate('');
    setTags('');
  };

  const handleEdit = (task: Task) => {
    setTitle(task.title);
    setDescription(task.description || '');
    setStatus(task.status as TaskStatus);
    setPriority(task.priority as TaskPriority);
    setDueDate(task.due_date ? new Date(task.due_date).toISOString().split('T')[0] : '');
    setTags(task.tags.join(', '));
    setEditingTaskId(task.id);
  };

  const handleDelete = async (taskId: string) => {
    try {
      const response = await fetch(`${process.env.NEXT_PUBLIC_API_BASE_URL}/api/tasks/${taskId}`, {
        method: 'DELETE',
        headers: {
          'Authorization': `Bearer ${localStorage.getItem('authToken')}`,
          'Content-Type': 'application/json',
        },
      });

      if (response.ok) {
        setTasks(tasks.filter(task => task.id !== taskId));
      } else {
        console.error('Failed to delete task');
      }
    } catch (error) {
      console.error('Error deleting task:', error);
    }
  };

  const toggleComplete = async (taskId: string) => {
    try {
      const response = await fetch(`${process.env.NEXT_PUBLIC_API_BASE_URL}/api/tasks/${taskId}/complete`, {
        method: 'PATCH',
        headers: {
          'Authorization': `Bearer ${localStorage.getItem('authToken')}`,
          'Content-Type': 'application/json',
        },
      });

      if (response.ok) {
        const updatedTask = await response.json();
        setTasks(tasks.map(task => 
          task.id === taskId ? { ...task, status: updatedTask.status } : task
        ));
      } else {
        console.error('Failed to toggle task completion');
      }
    } catch (error) {
      console.error('Error toggling task completion:', error);
    }
  };

  return (
    <div className="max-w-4xl mx-auto p-6">
      <h1 className="text-3xl font-bold mb-6 text-center">Todo Application</h1>
      
      {/* Search and Filter Controls */}
      <div className="mb-6 flex flex-col md:flex-row gap-4">
        <input
          type="text"
          placeholder="Search tasks..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className="flex-grow px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
        />
        <div className="flex gap-2">
          <button
            onClick={() => setFilter('all')}
            className={`px-4 py-2 rounded-lg ${filter === 'all' ? 'bg-blue-500 text-white' : 'bg-gray-200'}`}
          >
            All
          </button>
          <button
            onClick={() => setFilter('active')}
            className={`px-4 py-2 rounded-lg ${filter === 'active' ? 'bg-blue-500 text-white' : 'bg-gray-200'}`}
          >
            Active
          </button>
          <button
            onClick={() => setFilter('completed')}
            className={`px-4 py-2 rounded-lg ${filter === 'completed' ? 'bg-blue-500 text-white' : 'bg-gray-200'}`}
          >
            Completed
          </button>
        </div>
      </div>

      {/* Task Form */}
      <form onSubmit={handleSubmit} className="mb-8 p-6 bg-white rounded-lg shadow-md">
        <h2 className="text-xl font-semibold mb-4">{editingTaskId ? 'Edit Task' : 'Add New Task'}</h2>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
          <div>
            <label className="block text-sm font-medium mb-1">Title *</label>
            <input
              type="text"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              required
              className="w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>
          
          <div>
            <label className="block text-sm font-medium mb-1">Status</label>
            <select
              value={status}
              onChange={(e) => setStatus(e.target.value as TaskStatus)}
              className="w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
              <option value="todo">To Do</option>
              <option value="in_progress">In Progress</option>
              <option value="completed">Completed</option>
            </select>
          </div>
          
          <div>
            <label className="block text-sm font-medium mb-1">Priority</label>
            <select
              value={priority}
              onChange={(e) => setPriority(e.target.value as TaskPriority)}
              className="w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
              <option value="low">Low</option>
              <option value="medium">Medium</option>
              <option value="high">High</option>
            </select>
          </div>
          
          <div>
            <label className="block text-sm font-medium mb-1">Due Date</label>
            <input
              type="date"
              value={dueDate}
              onChange={(e) => setDueDate(e.target.value)}
              className="w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>
        </div>
        
        <div className="mb-4">
          <label className="block text-sm font-medium mb-1">Description</label>
          <textarea
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            rows={3}
            className="w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
        </div>
        
        <div className="mb-4">
          <label className="block text-sm font-medium mb-1">Tags (comma separated)</label>
          <input
            type="text"
            value={tags}
            onChange={(e) => setTags(e.target.value)}
            placeholder="work, personal, urgent"
            className="w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
        </div>
        
        <div className="flex justify-end gap-2">
          {editingTaskId && (
            <button
              type="button"
              onClick={resetForm}
              className="px-4 py-2 bg-gray-500 text-white rounded-lg hover:bg-gray-600"
            >
              Cancel
            </button>
          )}
          <button
            type="submit"
            className="px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600"
          >
            {editingTaskId ? 'Update Task' : 'Add Task'}
          </button>
        </div>
      </form>

      {/* Task List */}
      <div>
        <h2 className="text-xl font-semibold mb-4">Your Tasks</h2>
        
        {filteredTasks.length === 0 ? (
          <p className="text-center text-gray-500">No tasks found</p>
        ) : (
          <ul className="space-y-4">
            {filteredTasks.map((task) => (
              <li 
                key={task.id} 
                className={`p-4 border rounded-lg shadow-sm ${
                  task.status === 'completed' ? 'bg-green-50' : 'bg-white'
                }`}
              >
                <div className="flex justify-between items-start">
                  <div className="flex-1">
                    <div className="flex items-center">
                      <input
                        type="checkbox"
                        checked={task.status === 'completed'}
                        onChange={() => toggleComplete(task.id)}
                        className="mr-3 h-5 w-5"
                      />
                      <h3 className={`text-lg font-medium ${task.status === 'completed' ? 'line-through text-gray-500' : ''}`}>
                        {task.title}
                      </h3>
                    </div>
                    
                    {task.description && (
                      <p className="mt-2 text-gray-600">{task.description}</p>
                    )}
                    
                    <div className="mt-3 flex flex-wrap gap-2">
                      <span className={`px-2 py-1 rounded-full text-xs ${
                        task.priority === 'high' ? 'bg-red-100 text-red-800' :
                        task.priority === 'medium' ? 'bg-yellow-100 text-yellow-800' :
                        'bg-green-100 text-green-800'
                      }`}>
                        {task.priority.charAt(0).toUpperCase() + task.priority.slice(1)}
                      </span>
                      
                      <span className={`px-2 py-1 rounded-full text-xs ${
                        task.status === 'todo' ? 'bg-blue-100 text-blue-800' :
                        task.status === 'in_progress' ? 'bg-purple-100 text-purple-800' :
                        'bg-green-100 text-green-800'
                      }`}>
                        {task.status === 'todo' ? 'To Do' : 
                         task.status === 'in_progress' ? 'In Progress' : 'Completed'}
                      </span>
                      
                      {task.due_date && (
                        <span className="px-2 py-1 rounded-full text-xs bg-gray-100 text-gray-800">
                          Due: {new Date(task.due_date).toLocaleDateString()}
                        </span>
                      )}
                      
                      {task.tags && task.tags.length > 0 && (
                        <div className="flex flex-wrap gap-1">
                          {task.tags.map((tag, index) => (
                            <span key={index} className="px-2 py-1 rounded-full text-xs bg-indigo-100 text-indigo-800">
                              {tag}
                            </span>
                          ))}
                        </div>
                      )}
                    </div>
                  </div>
                  
                  <div className="flex space-x-2 ml-4">
                    <button
                      onClick={() => handleEdit(task)}
                      className="text-blue-500 hover:text-blue-700"
                    >
                      Edit
                    </button>
                    <button
                      onClick={() => handleDelete(task.id)}
                      className="text-red-500 hover:text-red-700"
                    >
                      Delete
                    </button>
                  </div>
                </div>
              </li>
            ))}
          </ul>
        )}
      </div>
    </div>
  );
};

export default TodoList;