"use client";

import { useState, useEffect } from "react";
import { getSession, signOut } from "../../lib/auth-client";
import { useRouter } from "next/navigation";

export default function TasksPage() {
  const [session, setSession] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [showAddForm, setShowAddForm] = useState(false);
  const [newTask, setNewTask] = useState({ title: "", description: "" });
  const [tasks, setTasks] = useState<any[]>([]);
  const [error, setError] = useState("");

  const router = useRouter();

  // Check session on component mount
  useEffect(() => {
    const checkSession = async () => {
      try {
        const sessionData = await getSession();
        if (!sessionData) {
          // If no session, redirect to sign in
          router.push('/signin');
          return;
        }
        setSession(sessionData);
      } catch (err) {
        console.error("Session check failed:", err);
        router.push('/signin');
      } finally {
        setLoading(false);
      }
    };

    checkSession();
  }, [router]);

  const handleSignOut = async () => {
    await signOut();
    router.push('/signin');
  };

  const handleAddTask = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");

    try {
      // In a real app, you would make an API call to add the task to your backend
      // For now, we'll just add it to the local state
      const taskToAdd = {
        id: Date.now(),
        title: newTask.title,
        description: newTask.description,
        createdAt: new Date().toISOString(),
        userId: session?.user.id
      };

      setTasks([...tasks, taskToAdd]);
      setNewTask({ title: "", description: "" });
      setShowAddForm(false);
    } catch (err) {
      setError("Failed to add task. Please try again.");
      console.error("Add task error:", err);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-xl">Checking session...</div>
      </div>
    );
  }

  if (!session) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-xl">Redirecting to sign in...</div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <header className="bg-white shadow">
        <div className="max-w-7xl mx-auto px-4 py-6 sm:px-6 lg:px-8 flex justify-between items-center">
          <h1 className="text-3xl font-bold text-gray-900">Tasks</h1>
          <div className="flex items-center space-x-4">
            <span className="text-gray-700">Welcome, {session.user.name || session.user.email}</span>
            <button
              onClick={handleSignOut}
              className="ml-4 bg-red-600 hover:bg-red-700 text-white py-2 px-4 rounded-md transition duration-150 ease-in-out"
            >
              Sign Out
            </button>
          </div>
        </div>
      </header>

      <main className="max-w-7xl mx-auto px-4 py-6 sm:px-6 lg:px-8">
        <div className="mb-6">
          <button
            onClick={() => setShowAddForm(!showAddForm)}
            className="bg-blue-600 hover:bg-blue-700 text-white py-2 px-4 rounded-md transition duration-150 ease-in-out"
          >
            {showAddForm ? "Cancel" : "Add Task"}
          </button>
        </div>

        {showAddForm && (
          <div className="mb-8 bg-white p-6 rounded-lg shadow-md">
            <h2 className="text-xl font-semibold mb-4">Add New Task</h2>
            {error && (
              <div className="mb-4 text-red-600">{error}</div>
            )}
            <form onSubmit={handleAddTask}>
              <div className="mb-4">
                <label htmlFor="title" className="block text-gray-700 font-medium mb-2">
                  Title
                </label>
                <input
                  type="text"
                  id="title"
                  value={newTask.title}
                  onChange={(e) => setNewTask({...newTask, title: e.target.value})}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-blue-500"
                  required
                />
              </div>
              <div className="mb-4">
                <label htmlFor="description" className="block text-gray-700 font-medium mb-2">
                  Description
                </label>
                <textarea
                  id="description"
                  value={newTask.description}
                  onChange={(e) => setNewTask({...newTask, description: e.target.value})}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-blue-500"
                  rows={3}
                />
              </div>
              <button
                type="submit"
                className="bg-green-600 hover:bg-green-700 text-white py-2 px-4 rounded-md transition duration-150 ease-in-out"
              >
                Add Task
              </button>
            </form>
          </div>
        )}

        <div className="bg-white shadow overflow-hidden sm:rounded-md">
          <ul className="divide-y divide-gray-200">
            {tasks.length === 0 ? (
              <li className="px-6 py-4 text-gray-500">No tasks yet. Add your first task!</li>
            ) : (
              tasks.map((task) => (
                <li key={task.id} className="px-6 py-4">
                  <div className="flex items-center justify-between">
                    <h3 className="text-lg font-medium text-gray-900">{task.title}</h3>
                    <span className="text-sm text-gray-500">
                      {new Date(task.createdAt).toLocaleDateString()}
                    </span>
                  </div>
                  <p className="mt-1 text-sm text-gray-500">{task.description}</p>
                </li>
              ))
            )}
          </ul>
        </div>
      </main>
    </div>
  );
}