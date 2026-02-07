import { getServerTasks } from '../../lib/api-server';
import { Task } from '../../lib/api';

interface TasksServerComponentProps {
  searchParams: {
    [key: string]: string | string[] | undefined;
  };
}

export default async function TasksServerComponent({ searchParams }: TasksServerComponentProps) {
  // Extract filters from search params
  const search = typeof searchParams.search === 'string' ? searchParams.search : undefined;
  const status = typeof searchParams.status === 'string' ? searchParams.status : undefined;
  const priority = typeof searchParams.priority === 'string' ? searchParams.priority : undefined;
  const sort_by = typeof searchParams.sort_by === 'string' ? searchParams.sort_by : undefined;
  const order = typeof searchParams.order === 'string' ? searchParams.order : undefined;

  let tasks: Task[] = [];
  let error: string | null = null;

  try {
    const filters: any = {};
    if (search) filters.search = search;
    if (status) filters.status = status;
    if (priority) filters.priority = priority;
    if (sort_by) filters.sort_by = sort_by;
    if (order) filters.order = order;

    tasks = await getServerTasks(filters) as Task[];
  } catch (err) {
    console.error('Error fetching tasks on server:', err);
    error = 'Failed to load tasks. Please try again later.';
  }

  return (
    <div className="bg-white shadow rounded-lg overflow-hidden">
      {error ? (
        <div className="text-center py-8">
          <p className="text-red-600">{error}</p>
        </div>
      ) : tasks.length === 0 ? (
        <div className="text-center py-8 text-gray-500">
          <p>No tasks found.</p>
        </div>
      ) : (
        <ul>
          {tasks.map((task) => (
            <li key={task.id} className="border-b border-gray-200 last:border-b-0">
              <div className="p-4 flex justify-between items-center">
                <div>
                  <h3 className="text-lg font-medium text-gray-900">{task.title}</h3>
                  {task.description && (
                    <p className="text-gray-600 mt-1">{task.description}</p>
                  )}
                  <div className="mt-2 flex items-center space-x-4">
                    <span className={`px-2 py-1 text-xs rounded-full ${
                      task.status === 'todo' ? 'bg-yellow-100 text-yellow-800' :
                      task.status === 'in_progress' ? 'bg-blue-100 text-blue-800' :
                      'bg-green-100 text-green-800'
                    }`}>
                      {task.status.replace('_', ' ')}
                    </span>
                    <span className={`px-2 py-1 text-xs rounded-full ${
                      task.priority === 'low' ? 'bg-green-100 text-green-800' :
                      task.priority === 'medium' ? 'bg-yellow-100 text-yellow-800' :
                      'bg-red-100 text-red-800'
                    }`}>
                      {task.priority}
                    </span>
                  </div>
                </div>
              </div>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}