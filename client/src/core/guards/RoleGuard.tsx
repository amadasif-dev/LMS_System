import { Navigate, Outlet } from 'react-router-dom';
import { useAppSelector } from '../store/hooks';
import type { UserRole } from '../api/types';

interface RoleGuardProps {
  allowedRoles: UserRole[];
  fallback?: string;
}

export const RoleGuard = ({ allowedRoles, fallback = '/unauthorized' }: RoleGuardProps) => {
  const { user } = useAppSelector((state) => state.auth);

  if (!user || !allowedRoles.includes(user.role as UserRole)) {
    return <Navigate to={fallback} replace />;
  }

  return <Outlet />;
};
