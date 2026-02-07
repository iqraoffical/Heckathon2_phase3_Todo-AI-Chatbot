'use client';

import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X } from 'lucide-react';

type ToastType = 'success' | 'error' | 'info' | 'warning';

interface Toast {
  id: string;
  title: string;
  description?: string;
  type: ToastType;
}

const ToastProvider = ({ children }: { children: React.ReactNode }) => {
  const [toasts, setToasts] = useState<Toast[]>([]);

  const addToast = (toast: Omit<Toast, 'id'>) => {
    const id = Math.random().toString(36).substring(7);
    setToasts((prev) => [...prev, { ...toast, id }]);
  };

  const removeToast = (id: string) => {
    setToasts((prev) => prev.filter(toast => toast.id !== id));
  };

  // Expose the addToast function globally
  useEffect(() => {
    (window as any).addToast = addToast;
  }, []);

  return (
    <>
      <div className="fixed top-4 right-4 z-50 space-y-2 max-w-xs w-full">
        <AnimatePresence>
          {toasts.map((toast) => (
            <ToastItem
              key={toast.id}
              toast={toast}
              onClose={() => removeToast(toast.id)}
            />
          ))}
        </AnimatePresence>
      </div>
      {children}
    </>
  );
};

const ToastItem = ({ toast, onClose }: { toast: Toast; onClose: () => void }) => {
  const getToastColor = () => {
    switch (toast.type) {
      case 'success':
        return 'bg-green-500/20 border-green-500/30 text-green-200';
      case 'error':
        return 'bg-red-500/20 border-red-500/30 text-red-200';
      case 'warning':
        return 'bg-yellow-500/20 border-yellow-500/30 text-yellow-200';
      case 'info':
        return 'bg-blue-500/20 border-blue-500/30 text-blue-200';
      default:
        return 'bg-white/10 border-white/20 text-white';
    }
  };

  useEffect(() => {
    const timer = setTimeout(() => {
      onClose();
    }, 5000);

    return () => clearTimeout(timer);
  }, [onClose]);

  return (
    <motion.div
      initial={{ opacity: 0, y: -20, scale: 0.8 }}
      animate={{ opacity: 1, y: 0, scale: 1 }}
      exit={{ opacity: 0, y: -20, scale: 0.8 }}
      className={`glass backdrop-blur-xl border ${getToastColor()} rounded-lg p-4 shadow-lg max-w-xs w-full`}
    >
      <div className="flex items-start justify-between">
        <div className="flex-1 min-w-0">
          <h4 className="font-medium truncate">{toast.title}</h4>
          {toast.description && (
            <p className="text-sm opacity-80 mt-1 truncate">{toast.description}</p>
          )}
        </div>
        <button
          onClick={onClose}
          className="ml-2 text-white/60 hover:text-white transition-colors"
        >
          <X className="h-4 w-4" />
        </button>
      </div>
    </motion.div>
  );
};

export { ToastProvider };