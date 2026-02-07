export const TaskListSkeleton = () => {
  return (
    <div className="space-y-4">
      {[...Array(5)].map((_, index) => (
        <div 
          key={index} 
          className="border rounded-lg p-4 shadow-sm bg-white animate-pulse"
        >
          <div className="flex items-start">
            <div className="mt-1 h-5 w-5 rounded bg-gray-200"></div>
            <div className="ml-3 flex-1 min-w-0">
              <div className="flex items-center justify-between">
                <div className="h-5 bg-gray-200 rounded w-1/3"></div>
                <div className="flex space-x-2 ml-2">
                  <div className="h-6 bg-gray-200 rounded w-16"></div>
                  <div className="h-6 bg-gray-200 rounded w-16"></div>
                </div>
              </div>
              
              <div className="mt-2 space-y-2">
                <div className="h-4 bg-gray-200 rounded w-5/6"></div>
                <div className="h-4 bg-gray-200 rounded w-4/6"></div>
              </div>

              <div className="mt-3 flex flex-wrap items-center justify-between gap-2">
                <div className="flex items-center text-sm text-gray-200">
                  <div className="mr-1.5 h-5 w-5 bg-gray-200"></div>
                  Due: Loading...
                </div>

                <div className="flex flex-wrap gap-1">
                  <div className="h-5 w-12 bg-gray-200 rounded"></div>
                  <div className="h-5 w-16 bg-gray-200 rounded"></div>
                </div>
              </div>
            </div>
          </div>
        </div>
      ))}
    </div>
  );
};