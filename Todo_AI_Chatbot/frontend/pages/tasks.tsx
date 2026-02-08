// pages/tasks.tsx
import React from 'react';
import Head from 'next/head';
import TaskList from '../components/TaskList';

// Mock user ID - in a real app, this would come from authentication
const userId = '123e4567-e89b-12d3-a456-426614174000';

const TasksPage: React.FC = () => {
  return (
    <div className="min-h-screen bg-gray-100">
      <Head>
        <title>Your Tasks | Todo AI Chatbot</title>
        <meta name="description" content="Manage your tasks" />
      </Head>

      <div className="container mx-auto px-4 py-8">
        <TaskList userId={userId} />
      </div>
    </div>
  );
};

export default TasksPage;