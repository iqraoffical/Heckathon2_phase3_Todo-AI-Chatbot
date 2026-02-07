'use client';

import { useState } from 'react';
import { motion } from 'framer-motion';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Trash2, Pencil, Eye } from 'lucide-react';
import { apiClient } from '@/lib/api';
import ViewTaskModal from '@/components/ViewTaskModal';

interface TaskCardProps {
  id: string;
  title: string;
  description?: string;
  status: 'todo' | 'in_progress' | 'completed' | 'in-progress'; // Support both formats
  priority: 'low' | 'medium' | 'high' | 'urgent';
  dueDate?: string;
  tags?: string[];
  category?: string;
  estimatedTime?: number;
  actualTimeSpent?: number;
  projectId?: string;
  completed: boolean;
  onStatusChange?: (id: string, newStatus: 'todo' | 'in_progress' | 'completed' | 'in-progress') => void;
  onCompleteToggle?: (id: string, completed: boolean) => void;
  onTaskDelete?: (id: string) => void; // Callback when a task is deleted
  onTaskEdit?: (task: any) => void; // Callback when a task is edited
}

const TaskCard = ({
  id,
  title,
  description,
  status,
  priority,
  dueDate,
  tags = [],
  completed,
  onStatusChange,
  onCompleteToggle,
  onTaskDelete,
  onTaskEdit
}: TaskCardProps) => {
  const [isChecked, setIsChecked] = useState(completed);
  const [isDeleting, setIsDeleting] = useState(false);
  const [isViewModalOpen, setIsViewModalOpen] = useState(false);

  const handleCheckboxChange = () => {
    const newCompletedState = !isChecked;
    setIsChecked(newCompletedState);
    if (onCompleteToggle) {
      onCompleteToggle(id, newCompletedState);
    }
    if (onStatusChange) {
      // Use the same status format as the current status
      const newStatus = newCompletedState ?
        (status === 'in-progress' || status === 'in_progress' ? 'in_progress' : 'completed') :
        (status === 'in-progress' || status === 'in_progress' ? 'in_progress' : 'todo');
      onStatusChange(id, newStatus);
    }
  };

  const handleDelete = async () => {
    if (window.confirm('Are you sure you want to delete this task?')) {
      setIsDeleting(true);
      try {
        await apiClient.deleteTask(id);
        if (onTaskDelete) {
          onTaskDelete(id);
        }
      } catch (error) {
        console.error('Error deleting task:', error);
        alert('Failed to delete task. Please try again.');
      } finally {
        setIsDeleting(false);
      }
    }
  };

  const handleEdit = () => {
    // Pass the current task data to the parent component
    const taskData = {
      id,
      title,
      description,
      status,
      priority,
      dueDate,
      tags,
      category,
      estimatedTime,
      actualTimeSpent,
      projectId
    };

    if (onTaskEdit) {
      onTaskEdit(taskData);
    }
  };

  const handleView = () => {
    setIsViewModalOpen(true);
  };

  const handleViewModalClose = () => {
    setIsViewModalOpen(false);
  };

  // Format due date if provided
  const formatDate = (dateString?: string) => {
    if (!dateString) return '';
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', {
      month: 'short',
      day: 'numeric',
      year: 'numeric'
    });
  };

  // Priority badge variant
  const getPriorityVariant = (priority: string) => {
    switch (priority) {
      case 'urgent':
        return 'red';
      case 'high':
        return 'yellow';
      case 'medium':
        return 'blue';
      case 'low':
        return 'green';
      default:
        return 'purple';
    }
  };

  // Status badge variant
  const getStatusVariant = (status: string) => {
    switch (status) {
      case 'completed':
        return 'green';
      case 'in-progress':
      case 'in_progress':
        return 'blue';
      case 'todo':
        return 'purple';
      default:
        return 'purple';
    }
  };

  return (
    <>
      <motion.div
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        exit={{ opacity: 0, y: -10 }}
        transition={{ duration: 0.2 }}
        className={`border rounded-lg p-4 shadow-sm transition-all duration-200 ${
          completed ? 'bg-black/20 opacity-80' : 'glass backdrop-blur-lg border-yellow-500/20 hover:shadow-lg'
        }`}
      >
        <div className="flex items-start">
          <input
            type="checkbox"
            checked={isChecked}
            onChange={handleCheckboxChange}
            className="mt-1 h-5 w-5 rounded border-yellow-500 text-yellow-500 focus:ring-yellow-500"
          />
          <div className="ml-3 flex-1 min-w-0">
            <div className="flex items-center justify-between">
              <h3 className={`text-lg font-medium truncate ${completed ? 'line-through text-gray-400' : 'text-white text-high-contrast'}`}>
                {title}
              </h3>
              <div className="flex space-x-2 ml-2">
                <Badge variant={getStatusVariant(status)}>
                  {status === 'in_progress' ? 'in progress' : status.replace('-', ' ')}
                </Badge>
                <Badge variant={getPriorityVariant(priority)}>
                  {priority.charAt(0).toUpperCase() + priority.slice(1)}
                </Badge>
              </div>
            </div>

            {description && (
              <p className={`mt-2 text-sm ${completed ? 'text-gray-500' : 'text-gray-300 text-secondary'}`}>
                {description}
              </p>
            )}

            <div className="mt-3 flex flex-wrap items-center justify-between gap-2">
              {dueDate && (
                <div className="flex items-center text-sm text-gray-400 text-secondary">
                  <svg className="flex-shrink-0 mr-1.5 h-5 w-5 text-gray-400" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor">
                    <path fillRule="evenodd" d="M6 2a1 1 0 00-1 1v1H4a2 2 0 00-2 2v10a2 2 0 002 2h12a2 2 0 002-2V6a2 2 0 00-2-2h-1V3a1 1 0 10-2 0v1H7V3a1 1 0 00-1-1zm0 5a1 1 0 000 2h8a1 1 0 100-2H6z" clipRule="evenodd" />
                  </svg>
                  Due: {formatDate(dueDate)}
                </div>
              )}

              {tags.length > 0 && (
                <div className="flex flex-wrap gap-1">
                  {tags.map((tag, index) => (
                    <Badge key={index} variant="outline" className="border-yellow-500/30 text-yellow-200">
                      {tag}
                    </Badge>
                  ))}
                </div>
              )}

              <div className="flex space-x-2">
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={handleView}
                  className="h-8 w-8 p-0 text-gray-400 hover:text-yellow-400"
                  aria-label="View task"
                >
                  <Eye className="h-4 w-4" />
                </Button>
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={handleEdit}
                  className="h-8 w-8 p-0 text-gray-400 hover:text-yellow-400"
                  aria-label="Edit task"
                >
                  <Pencil className="h-4 w-4" />
                </Button>
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={handleDelete}
                  disabled={isDeleting}
                  className="h-8 w-8 p-0 text-gray-400 hover:text-red-400 disabled:opacity-50"
                  aria-label="Delete task"
                >
                  <Trash2 className="h-4 w-4" />
                </Button>
              </div>
            </div>
          </div>
        </div>
      </motion.div>

      <ViewTaskModal
        isOpen={isViewModalOpen}
        onClose={handleViewModalClose}
        task={{
          id,
          title,
          description,
          status,
          priority,
          dueDate,
          tags
        }}
      />
    </>
  );
};

export default TaskCard;