'use client';

import { useState, useEffect } from 'react';
import { useSearchParams, useRouter } from 'next/navigation';

interface TaskFiltersProps {
  onFiltersChange?: (filters: {
    search: string;
    status: string;
    priority: string;
    category: string; // Added category filter
    projectId: string; // Added project ID filter
    tags: string; // Added tags filter
    dueDateFrom: string; // Added due date from filter
    dueDateTo: string; // Added due date to filter
    sortBy: string;
    order: string;
  }) => void;
}

const TaskFilters = ({ onFiltersChange }: TaskFiltersProps) => {
  const router = useRouter();
  const searchParams = useSearchParams();

  // Initialize state from URL params
  const [search, setSearch] = useState(searchParams.get('search') || '');
  const [status, setStatus] = useState(searchParams.get('status') || '');
  const [priority, setPriority] = useState(searchParams.get('priority') || '');
  const [category, setCategory] = useState(searchParams.get('category') || ''); // Added category state
  const [projectId, setProjectId] = useState(searchParams.get('project_id') || ''); // Added project ID state
  const [tags, setTags] = useState(searchParams.get('tags') || ''); // Added tags state
  const [dueDateFrom, setDueDateFrom] = useState(searchParams.get('due_date_from') || ''); // Added due date from state
  const [dueDateTo, setDueDateTo] = useState(searchParams.get('due_date_to') || ''); // Added due date to state
  const [sortBy, setSortBy] = useState(searchParams.get('sortBy') || 'createdAt');
  const [order, setOrder] = useState(searchParams.get('order') || 'desc');

  // Update URL params when filters change
  useEffect(() => {
    const params = new URLSearchParams();

    if (search) params.set('search', search);
    if (status) params.set('status', status);
    if (priority) params.set('priority', priority);
    if (category) params.set('category', category); // Added category to URL params
    if (projectId) params.set('project_id', projectId); // Added project ID to URL params
    if (tags) params.set('tags', tags); // Added tags to URL params
    if (dueDateFrom) params.set('due_date_from', dueDateFrom); // Added due date from to URL params
    if (dueDateTo) params.set('due_date_to', dueDateTo); // Added due date to to URL params
    if (sortBy) params.set('sortBy', sortBy);
    if (order) params.set('order', order);

    router.push(`?${params.toString()}`, { scroll: false });

    // Notify parent component of filter changes
    if (onFiltersChange) {
      onFiltersChange({
        search,
        status,
        priority,
        category, // Added category to filter object
        projectId, // Added project ID to filter object
        tags, // Added tags to filter object
        dueDateFrom, // Added due date from to filter object
        dueDateTo, // Added due date to to filter object
        sortBy,
        order
      });
    }
  }, [search, status, priority, category, projectId, tags, dueDateFrom, dueDateTo, sortBy, order, router, onFiltersChange]);

  // Reset all filters
  const resetFilters = () => {
    setSearch('');
    setStatus('');
    setPriority('');
    setCategory(''); // Reset category filter
    setProjectId(''); // Reset project ID filter
    setTags(''); // Reset tags filter
    setDueDateFrom(''); // Reset due date from filter
    setDueDateTo(''); // Reset due date to filter
    setSortBy('createdAt');
    setOrder('desc');
  };

  return (
    <div className="glass backdrop-blur-xl border-yellow-500/30 bg-gradient-to-br from-black/30 to-black/10 p-4 rounded-lg">
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-10 gap-4">
        {/* Search Input */}
        <div className="lg:col-span-2">
          <label htmlFor="search" className="block text-sm font-medium text-white text-high-contrast mb-1">
            Search
          </label>
          <div className="relative">
            <input
              type="text"
              id="search"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Search tasks..."
              className="w-full px-4 py-2 bg-black/20 border border-yellow-500/30 rounded-md focus:ring-2 focus:ring-yellow-500 focus:border-yellow-500 text-white placeholder:text-yellow-300 backdrop-blur-sm"
            />
            {search && (
              <button
                onClick={() => setSearch('')}
                className="absolute right-3 top-1/2 transform -translate-y-1/2 text-yellow-300 hover:text-white"
              >
                <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                  <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clipRule="evenodd" />
                </svg>
              </button>
            )}
          </div>
        </div>

        {/* Status Filter */}
        <div>
          <label htmlFor="status" className="block text-sm font-medium text-white text-high-contrast mb-1">
            Status
          </label>
          <select
            id="status"
            value={status}
            onChange={(e) => setStatus(e.target.value)}
            className="w-full px-4 py-2 bg-black/20 border border-yellow-500/30 rounded-md focus:ring-2 focus:ring-yellow-500 focus:border-yellow-500 text-white backdrop-blur-sm"
          >
            <option value="" className="bg-black text-white">All Statuses</option>
            <option value="todo" className="bg-black text-white">To Do</option>
            <option value="in-progress" className="bg-black text-white">In Progress</option>
            <option value="completed" className="bg-black text-white">Completed</option>
          </select>
        </div>

        {/* Priority Filter */}
        <div>
          <label htmlFor="priority" className="block text-sm font-medium text-white text-high-contrast mb-1">
            Priority
          </label>
          <select
            id="priority"
            value={priority}
            onChange={(e) => setPriority(e.target.value)}
            className="w-full px-4 py-2 bg-black/20 border border-yellow-500/30 rounded-md focus:ring-2 focus:ring-yellow-500 focus:border-yellow-500 text-white backdrop-blur-sm"
          >
            <option value="" className="bg-black text-white">All Priorities</option>
            <option value="low" className="bg-black text-white">Low</option>
            <option value="medium" className="bg-black text-white">Medium</option>
            <option value="high" className="bg-black text-white">High</option>
          </select>
        </div>

        {/* Category Filter */}
        <div>
          <label htmlFor="category" className="block text-sm font-medium text-white text-high-contrast mb-1">
            Category
          </label>
          <select
            id="category"
            value={category}
            onChange={(e) => setCategory(e.target.value)}
            className="w-full px-4 py-2 bg-black/20 border border-yellow-500/30 rounded-md focus:ring-2 focus:ring-yellow-500 focus:border-yellow-500 text-white backdrop-blur-sm"
          >
            <option value="" className="bg-black text-white">All Categories</option>
            <option value="work" className="bg-black text-white">Work</option>
            <option value="personal" className="bg-black text-white">Personal</option>
            <option value="shopping" className="bg-black text-white">Shopping</option>
            <option value="health" className="bg-black text-white">Health</option>
            <option value="finance" className="bg-black text-white">Finance</option>
          </select>
        </div>

        {/* Project Filter */}
        <div>
          <label htmlFor="projectId" className="block text-sm font-medium text-white text-high-contrast mb-1">
            Project
          </label>
          <select
            id="projectId"
            value={projectId}
            onChange={(e) => setProjectId(e.target.value)}
            className="w-full px-4 py-2 bg-black/20 border border-yellow-500/30 rounded-md focus:ring-2 focus:ring-yellow-500 focus:border-yellow-500 text-white backdrop-blur-sm"
          >
            <option value="" className="bg-black text-white">All Projects</option>
            <option value="project1" className="bg-black text-white">Project 1</option>
            <option value="project2" className="bg-black text-white">Project 2</option>
            <option value="project3" className="bg-black text-white">Project 3</option>
          </select>
        </div>

        {/* Tags Filter */}
        <div>
          <label htmlFor="tags" className="block text-sm font-medium text-white text-high-contrast mb-1">
            Tags
          </label>
          <select
            id="tags"
            value={tags}
            onChange={(e) => setTags(e.target.value)}
            className="w-full px-4 py-2 bg-black/20 border border-yellow-500/30 rounded-md focus:ring-2 focus:ring-yellow-500 focus:border-yellow-500 text-white backdrop-blur-sm"
          >
            <option value="" className="bg-black text-white">All Tags</option>
            <option value="work" className="bg-black text-white">Work</option>
            <option value="personal" className="bg-black text-white">Personal</option>
            <option value="urgent" className="bg-black text-white">Urgent</option>
            <option value="meeting" className="bg-black text-white">Meeting</option>
            <option value="development" className="bg-black text-white">Development</option>
            <option value="design" className="bg-black text-white">Design</option>
          </select>
        </div>

        {/* Due Date From Filter */}
        <div>
          <label htmlFor="dueDateFrom" className="block text-sm font-medium text-white text-high-contrast mb-1">
            Due Date From
          </label>
          <input
            type="date"
            id="dueDateFrom"
            value={dueDateFrom}
            onChange={(e) => setDueDateFrom(e.target.value)}
            className="w-full px-4 py-2 bg-black/20 border border-yellow-500/30 rounded-md focus:ring-2 focus:ring-yellow-500 focus:border-yellow-500 text-white backdrop-blur-sm"
          />
        </div>

        {/* Due Date To Filter */}
        <div>
          <label htmlFor="dueDateTo" className="block text-sm font-medium text-white text-high-contrast mb-1">
            Due Date To
          </label>
          <input
            type="date"
            id="dueDateTo"
            value={dueDateTo}
            onChange={(e) => setDueDateTo(e.target.value)}
            className="w-full px-4 py-2 bg-black/20 border border-yellow-500/30 rounded-md focus:ring-2 focus:ring-yellow-500 focus:border-yellow-500 text-white backdrop-blur-sm"
          />
        </div>

        {/* Sort By */}
        <div>
          <label htmlFor="sortBy" className="block text-sm font-medium text-white text-high-contrast mb-1">
            Sort By
          </label>
          <select
            id="sortBy"
            value={sortBy}
            onChange={(e) => setSortBy(e.target.value)}
            className="w-full px-4 py-2 bg-black/20 border border-yellow-500/30 rounded-md focus:ring-2 focus:ring-yellow-500 focus:border-yellow-500 text-white backdrop-blur-sm"
          >
            <option value="createdAt" className="bg-black text-white">Created Date</option>
            <option value="dueDate" className="bg-black text-white">Due Date</option>
            <option value="priority" className="bg-black text-white">Priority</option>
            <option value="title" className="bg-black text-white">Title</option>
            <option value="category" className="bg-black text-white">Category</option>
            <option value="project_id" className="bg-black text-white">Project</option>
          </select>
        </div>

        {/* Order */}
        <div>
          <label htmlFor="order" className="block text-sm font-medium text-white text-high-contrast mb-1">
            Order
          </label>
          <select
            id="order"
            value={order}
            onChange={(e) => setOrder(e.target.value)}
            className="w-full px-4 py-2 bg-black/20 border border-yellow-500/30 rounded-md focus:ring-2 focus:ring-yellow-500 focus:border-yellow-500 text-white backdrop-blur-sm"
          >
            <option value="asc" className="bg-black text-white">Ascending</option>
            <option value="desc" className="bg-black text-white">Descending</option>
          </select>
        </div>
      </div>

      {/* Reset Button */}
      <div className="mt-4 flex justify-end">
        <button
          onClick={resetFilters}
          className="px-4 py-2 text-sm font-medium text-white text-high-contrast bg-black/20 rounded-md hover:bg-black/30 focus:outline-none focus:ring-2 focus:ring-yellow-500 backdrop-blur-sm border border-yellow-500/30"
        >
          Reset Filters
        </button>
      </div>
    </div>
  );
};

export default TaskFilters;