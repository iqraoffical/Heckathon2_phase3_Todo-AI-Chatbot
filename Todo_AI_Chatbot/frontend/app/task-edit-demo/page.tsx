'use client';

import { useState } from 'react';
import TaskForm from '@/components/TaskForm';

export default function TaskEditFormPage() {
  const [showForm, setShowForm] = useState(true);
  const [submittedData, setSubmittedData] = useState<any>(null);

  // Sample initial data for editing
  const initialTaskData = {
    title: 'Sample Task for Editing',
    description: 'This is a sample task description that we will edit.',
    status: 'in_progress' as const,
    priority: 'high' as const,
    dueDate: '2024-12-31',
    tags: ['work', 'important', 'review']
  };

  const handleSubmit = (data: any) => {
    console.log('Form submitted with data:', data);
    setSubmittedData(data);
    setShowForm(false);
  };

  const handleCancel = () => {
    console.log('Form cancelled');
    setShowForm(false);
  };

  const handleReset = () => {
    setShowForm(true);
    setSubmittedData(null);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 to-black p-8">
      <div className="max-w-4xl mx-auto">
        <h1 className="text-3xl font-bold text-white mb-8">Task Form Edit Demo</h1>
        
        {submittedData ? (
          <div className="glass backdrop-blur-xl border-white/30 bg-gradient-to-br from-white/30 to-white/10 p-6 rounded-lg mb-6">
            <h2 className="text-xl font-semibold text-white mb-4">Updated Data:</h2>
            <pre className="text-white bg-black/30 p-4 rounded-md overflow-auto">
              {JSON.stringify(submittedData, null, 2)}
            </pre>
            <button 
              onClick={handleReset}
              className="mt-4 px-4 py-2 bg-gradient-to-r from-purple-500 to-blue-500 text-white rounded-md hover:opacity-90"
            >
              Edit Another Task
            </button>
          </div>
        ) : null}
        
        {showForm && (
          <TaskForm
            initialData={initialTaskData} // Pre-fill with initial data for editing
            onSubmit={handleSubmit}
            onCancel={handleCancel}
          />
        )}
        
        {!showForm && !submittedData && (
          <div className="text-center py-12">
            <p className="text-white mb-4">Task form was cancelled.</p>
            <button 
              onClick={handleReset}
              className="px-4 py-2 bg-gradient-to-r from-purple-500 to-blue-500 text-white rounded-md hover:opacity-90"
            >
              Edit Task Again
            </button>
          </div>
        )}
      </div>
    </div>
  );
}