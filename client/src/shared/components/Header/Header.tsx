import { Link } from 'react-router-dom';
import { Menu, LogOut, User } from 'lucide-react';
import { useAppSelector, useAppDispatch } from '../../../core/store/hooks';
import { logout } from '../../../core/store/slices/authSlice';
import { NotificationBell } from '../../../features/notifications/components/NotificationBell';
import { cn, getGreeting } from '../../../core/utils/helpers';

interface HeaderProps {
  onMenuClick?: () => void;
  className?: string;
}

export const Header = ({ onMenuClick, className }: HeaderProps) => {
  const dispatch = useAppDispatch();
  const { user } = useAppSelector((state) => state.auth);

  const handleLogout = () => {
    dispatch(logout());
  };

  return (
    <header
      className={cn(
        'h-16 bg-white border-b border-gray-200 flex items-center justify-between px-4 lg:px-6',
        className
      )}
    >
      <div className="flex items-center gap-4">
        <button
          onClick={onMenuClick}
          className="lg:hidden p-2 rounded-lg hover:bg-gray-100"
        >
          <Menu className="h-5 w-5 text-gray-600" />
        </button>
        <div className="hidden md:block">
          <p className="text-sm text-gray-500">{getGreeting()}</p>
          <p className="font-semibold text-gray-900">{user?.firstName} {user?.lastName}</p>
        </div>
      </div>

      <div className="flex items-center gap-2">
        <NotificationBell />
        
        <div className="h-6 w-px bg-gray-200 mx-2" />
        
        <Link
          to="/settings"
          className="p-2 rounded-lg hover:bg-gray-100 transition-colors"
        >
          <User className="h-5 w-5 text-gray-600" />
        </Link>
        
        <button
          onClick={handleLogout}
          className="p-2 rounded-lg hover:bg-gray-100 transition-colors text-gray-600 hover:text-red-600"
          title="Logout"
        >
          <LogOut className="h-5 w-5" />
        </button>
      </div>
    </header>
  );
};
