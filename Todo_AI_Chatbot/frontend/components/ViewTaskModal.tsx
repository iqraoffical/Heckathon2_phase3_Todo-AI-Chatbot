'use client';

import { useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';

interface ViewTaskModalProps {
  isOpen: boolean;
  onClose: () => void;
  task: {
    id: string;
    title: string;
    description?: string;
    status: 'todo' | 'in_progress' | 'completed' | 'in-progress';
    priority: 'low' | 'medium' | 'high' | 'urgent';
    dueDate?: string;
    tags?: string[];
    category?: string;
    estimatedTime?: number;
    actualTimeSpent?: number;
    projectId?: string;
  };
}

const ViewTaskModal = ({ isOpen, onClose, task }: ViewTaskModalProps) => {
  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = 'unset';
    }

    return () => {
      document.body.style.overflow = 'unset';
    };
  }, [isOpen]);

  // Format due date if provided
  const formatDate = (dateString?: string) => {
    if (!dateString) return 'N/A';
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

  if (!isOpen || !task) return null;

  return (
    <AnimatePresence>
      <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="fixed inset-0 bg-black/50 backdrop-blur-sm"
          onClick={onClose}
        />
        <motion.div
          initial={{ opacity: 0, scale: 0.9, y: 20 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.9, y: 20 }}
          className="relative glass backdrop-blur-xl border border-yellow-500/20 rounded-xl shadow-xl max-w-lg w-full max-h-[90vh] overflow-y-auto z-50"
          onClick={(e) => e.stopPropagation()}
        >
          <div className="p-6">
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-xl font-bold text-white">Task Details</h2>
              <button
                onClick={onClose}
                className="text-white/60 hover:text-white transition-colors"
              >
                <X className="h-5 w-5" />
              </button>
            </div>

            <div className="space-y-4">
              <div>
                <h3 className="text-lg font-semibold text-white text-high-contrast">{task.title}</h3>
              </div>

              <div className="flex flex-wrap gap-2">
                <Badge variant={getStatusVariant(task.status)}>
                  {task.status === 'in_progress' ? 'in progress' : task.status.replace('-', ' ')}
                </Badge>
                <Badge variant={getPriorityVariant(task.priority)}>
                  {task.priority.charAt(0).toUpperCase() + task.priority.slice(1)}
                </Badge>
              </div>

              {task.description && (
                <div>
                  <h4 className="text-sm font-medium text-gray-300 text-secondary mb-1">Description</h4>
                  <p className="text-gray-200 text-secondary">{task.description}</p>
                </div>
              )}

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <h4 className="text-sm font-medium text-gray-300 text-secondary mb-1">Due Date</h4>
                  <p className="text-gray-200 text-secondary">{formatDate(task.dueDate)}</p>
                </div>

                <div>
                  <h4 className="text-sm font-medium text-gray-300 text-secondary mb-1">ID</h4>
                  <p className="text-gray-200 text-secondary text-sm font-mono">{task.id}</p>
                </div>
              </div>

              {task.tags && task.tags.length > 0 && (
                <div>
                  <h4 className="text-sm font-medium text-gray-300 text-secondary mb-1">Tags</h4>
                  <div className="flex flex-wrap gap-1">
                    {task.tags.map((tag, index) => (
                      <Badge key={index} variant="outline" className="border-yellow-500/30 text-yellow-200">
                        {tag}
                      </Badge>
                    ))}
                  </div>
                </div>
              )}

              {(task.category || task.estimatedTime || task.actualTimeSpent || task.projectId) && (
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 pt-4 border-t border-gray-700/50">
                  {task.category && (
                    <div>
                      <h4 className="text-sm font-medium text-gray-300 text-secondary mb-1">Category</h4>
                      <p className="text-gray-200 text-secondary capitalize">{task.category}</p>
                    </div>
                  )}

                  {task.estimatedTime !== undefined && (
                    <div>
                      <h4 className="text-sm font-medium text-gray-300 text-secondary mb-1">Estimated Time</h4>
                      <p className="text-gray-200 text-secondary">{task.estimatedTime} minutes</p>
                    </div>
                  )}

                  {task.actualTimeSpent !== undefined && (
                    <div>
                      <h4 className="text-sm font-medium text-gray-300 text-secondary mb-1">Actual Time Spent</h4>
                      <p className="text-gray-200 text-secondary">{task.actualTimeSpent} minutes</p>
                    </div>
                  )}

                  {task.projectId && (
                    <div>
                      <h4 className="text-sm font-medium text-gray-300 text-secondary mb-1">Project ID</h4>
                      <p className="text-gray-200 text-secondary text-sm font-mono">{task.projectId}</p>
                    </div>
                  )}
                </div>
              )}

              <div className="pt-4 flex justify-end">
                <Button
                  onClick={onClose}
                  className="bg-gradient-to-r from-yellow-500 to-yellow-600 hover:from-yellow-600 hover:to-yellow-700 text-black"
                >
                  Close
                </Button>
              </div>
            </div>
          </div>
        </motion.div>
      </div>
    </AnimatePresence>
  );
};

export default ViewTaskModal;