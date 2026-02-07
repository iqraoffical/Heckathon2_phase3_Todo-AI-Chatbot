'use client';

import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X } from 'lucide-react';
import { Button } from '@/components/ui/button';
import TaskForm, { TaskFormData } from '@/components/TaskForm';
import { apiClient } from '@/lib/api';

interface TaskModalProps {
  isOpen: boolean;
  onClose: () => void;
  task?: TaskFormData & { id?: string }; // Optional task for editing
  onSuccess: () => void; // Callback when task is successfully added/updated
}

const TaskModal = ({ isOpen, onClose, task, onSuccess }: TaskModalProps) => {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);

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

  const handleSubmit = async (data: TaskFormData) => {
    setIsSubmitting(true);
    setError(null);

    try {
      if (task?.id) {
        // Update existing task
        await apiClient.updateTask(task.id, {
          ...data,
          due_date: data.dueDate || undefined,
          tags: data.tags
        });
      } else {
        // Create new task
        await apiClient.createTask({
          ...data,
          due_date: data.dueDate || undefined,
          tags: data.tags
        });
      }
      
      onSuccess();
      onClose();
    } catch (err) {
      console.error('Error saving task:', err);
      setError(err instanceof Error ? err.message : 'An error occurred while saving the task');
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleCancel = () => {
    setError(null);
    onClose();
  };

  if (!isOpen) return null;

  return (
    <AnimatePresence>
      <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="fixed inset-0 bg-black/50 backdrop-blur-sm"
          onClick={handleCancel}
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
              <h2 className="text-xl font-bold text-white text-high-contrast">
                {task?.id ? 'Edit Task' : 'Add New Task'}
              </h2>
              <button
                onClick={handleCancel}
                className="text-white/60 hover:text-white transition-colors"
                disabled={isSubmitting}
              >
                <X className="h-5 w-5" />
              </button>
            </div>

            {error && (
              <div className="mb-4 p-3 bg-red-500/20 border border-red-500/30 rounded-md text-red-200 text-secondary">
                {error}
              </div>
            )}

            <TaskForm
              initialData={task}
              onSubmit={handleSubmit}
              onCancel={handleCancel}
            />
          </div>
        </motion.div>
      </div>
    </AnimatePresence>
  );
};

export default TaskModal;