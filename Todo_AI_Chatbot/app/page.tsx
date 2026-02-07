import Link from 'next/link';

export default function HomePage() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 flex flex-col items-center justify-center p-4">
      <div className="max-w-md w-full bg-white rounded-xl shadow-md overflow-hidden md:max-w-2xl">
        <div className="p-8">
          <div className="text-center">
            <h1 className="text-3xl font-bold text-gray-800 mb-2">Task Manager</h1>
            <p className="text-gray-600 mb-8">A secure application to manage your daily tasks</p>
            
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Link 
                href="/signin" 
                className="px-6 py-3 bg-blue-600 text-white font-medium rounded-md hover:bg-blue-700 transition duration-150 ease-in-out"
              >
                Sign In
              </Link>
              
              <Link 
                href="/signup" 
                className="px-6 py-3 bg-gray-800 text-white font-medium rounded-md hover:bg-gray-900 transition duration-150 ease-in-out"
              >
                Create Account
              </Link>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}