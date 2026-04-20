import { Outlet } from 'react-router-dom';
import { Toaster } from 'react-hot-toast';

export const AuthLayout = () => {
  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 flex items-center justify-center p-4">
      <div className="w-full max-w-md">
        <div className="text-center mb-8">
          <h1 className="text-3xl font-bold text-gray-900">LMS Pro</h1>
          <p className="text-gray-600 mt-2">Learning Management System</p>
        </div>
        <Outlet />
      </div>
      <Toaster position="top-center" />
    </div>
  );
};
