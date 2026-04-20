import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import { useAppDispatch, useAppSelector } from '../../../core/store/hooks';
import { login } from '../../../core/store/slices/authSlice';
import { Button } from '../../../shared/components/Button/Button';
import { Input } from '../../../shared/components/Input/Input';
import { Toast } from '../../../shared/components/Toast/Toast';
import { Mail, Lock } from 'lucide-react';

const loginSchema = z.object({
  email: z.string().email('Invalid email address'),
  password: z.string().min(6, 'Password must be at least 6 characters'),
});

type LoginFormData = z.infer<typeof loginSchema>;

export const LoginForm = () => {
  const dispatch = useAppDispatch();
  const { loading } = useAppSelector((state) => state.auth);

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<LoginFormData>({
    resolver: zodResolver(loginSchema),
  });

  const onSubmit = async (data: LoginFormData) => {
    const result = await dispatch(login(data));
    if (login.rejected.match(result)) {
      Toast.error(result.payload as string);
    } else {
      Toast.success('Login successful!');
    }
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-5">
      <Input
        label="Email Address"
        type="email"
        placeholder="name@company.com"
        leftIcon={<Mail className="h-5 w-5 text-gray-400" />}
        error={errors.email?.message}
        {...register('email')}
      />
      <Input
        label="Password"
        type="password"
        placeholder="••••••••"
        leftIcon={<Lock className="h-5 w-5 text-gray-400" />}
        error={errors.password?.message}
        {...register('password')}
      />
      <div className="pt-2">
        <Button type="submit" fullWidth isLoading={loading} size="lg">
          Sign In
        </Button>
      </div>
    </form>
  );
};
