import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import { Card } from '../../../shared/components/Card/Card';
import { Button } from '../../../shared/components/Button/Button';
import { Input } from '../../../shared/components/Input/Input';
import { Toast } from '../../../shared/components/Toast/Toast';
import { Link } from 'react-router-dom';
import { Mail, ArrowLeft } from 'lucide-react';
import { authAPI } from '../../../core/api/endpoints/auth';

const forgotPasswordSchema = z.object({
  email: z.string().email('Invalid email address'),
});

type ForgotPasswordFormData = z.infer<typeof forgotPasswordSchema>;

export const ForgotPasswordPage = () => {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSubmitted, setIsSubmitted] = useState(false);

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<ForgotPasswordFormData>({
    resolver: zodResolver(forgotPasswordSchema),
  });

  const onSubmit = async (data: ForgotPasswordFormData) => {
    setIsSubmitting(true);
    try {
      await authAPI.forgotPassword(data.email);
      setIsSubmitted(true);
      Toast.success('Password reset link sent to your email');
    } catch {
      Toast.error('Failed to send reset link');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <Card className="w-full">
      <div className="text-center mb-6">
        <h2 className="text-2xl font-bold text-gray-900">Forgot Password?</h2>
        <p className="text-gray-600 mt-1">
          Enter your email and we'll send you a reset link
        </p>
      </div>

      {isSubmitted ? (
        <div className="text-center py-4">
          <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
            <Mail className="h-8 w-8 text-green-600" />
          </div>
          <p className="text-gray-700 mb-4">
            Check your email for the password reset link.
          </p>
          <Link to="/login" className="text-blue-600 hover:text-blue-700">
            Back to login
          </Link>
        </div>
      ) : (
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
          <Input
            label="Email"
            type="email"
            placeholder="Enter your email"
            leftIcon={<Mail className="h-5 w-5 text-gray-400" />}
            error={errors.email?.message}
            {...register('email')}
          />
          <Button type="submit" fullWidth isLoading={isSubmitting}>
            Send Reset Link
          </Button>
        </form>
      )}

      <div className="mt-6">
        <Link
          to="/login"
          className="flex items-center justify-center text-sm text-gray-600 hover:text-gray-900"
        >
          <ArrowLeft className="h-4 w-4 mr-2" />
          Back to login
        </Link>
      </div>
    </Card>
  );
};
