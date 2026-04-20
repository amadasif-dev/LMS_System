import { LoginForm } from '../components/LoginForm';
import { Card } from '../../../shared/components/Card/Card';
import { Link } from 'react-router-dom';

export const LoginPage = () => {
  return (
    <Card className="w-full max-w-md mx-auto shadow-lg" noPadding>
      <div className="p-8">
        <div className="text-center mb-8">
          <div className="inline-flex items-center justify-center w-12 h-12 rounded-xl bg-blue-600 text-white mb-4">
            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253" />
            </svg>
          </div>
          <h2 className="text-2xl font-bold text-gray-900">Welcome Back</h2>
          <p className="text-gray-500 mt-2">Sign in to your account to continue</p>
        </div>
        <LoginForm />
        <div className="mt-6 text-center">
          <Link to="/forgot-password" className="text-sm text-blue-600 hover:text-blue-700 font-medium">
            Forgot your password?
          </Link>
        </div>
      </div>
    </Card>
  );
};
