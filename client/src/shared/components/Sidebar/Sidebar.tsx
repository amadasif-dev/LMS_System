import { useState } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { cn } from '../../../core/utils/helpers';
import { navItems } from './NavItems';
import { useAppSelector } from '../../../core/store/hooks';
import * as Icons from 'lucide-react';
import type { LucideIcon } from 'lucide-react';

interface SidebarProps {
  className?: string;
}

export const Sidebar = ({ className }: SidebarProps) => {
  const location = useLocation();
  const { user } = useAppSelector((state) => state.auth);
  const [isCollapsed, setIsCollapsed] = useState(false);

  const filteredNavItems = navItems.filter((item) =>
    user?.role ? item.roles.includes(user.role as any) : false
  );

  const getIcon = (iconName: string): LucideIcon => {
    return (Icons as Record<string, LucideIcon>)[iconName] || Icons.Circle;
  };

  return (
    <aside
      className={cn(
        'fixed left-0 top-0 z-40 h-screen bg-white border-r border-gray-200 transition-all duration-300',
        isCollapsed ? 'w-16' : 'w-64',
        className
      )}
    >
      <div className="flex items-center justify-between h-16 px-4 border-b border-gray-200">
        {!isCollapsed && (
          <Link to="/dashboard" className="text-xl font-bold text-blue-600">
            LMS Pro
          </Link>
        )}
        <button
          onClick={() => setIsCollapsed(!isCollapsed)}
          className="p-1 rounded-lg hover:bg-gray-100"
        >
          {isCollapsed ? (
            <Icons.ChevronRight className="h-5 w-5" />
          ) : (
            <Icons.ChevronLeft className="h-5 w-5" />
          )}
        </button>
      </div>

      <nav className="flex-1 overflow-y-auto py-4">
        <ul className="space-y-1 px-2">
          {filteredNavItems.map((item) => {
            const Icon = getIcon(item.icon);
            const isActive = location.pathname === item.href ||
              location.pathname.startsWith(item.href + '/');

            return (
              <li key={item.href}>
                <Link
                  to={item.href}
                  className={cn(
                    'flex items-center gap-3 px-3 py-2 rounded-lg transition-colors',
                    isActive
                      ? 'bg-blue-50 text-blue-600'
                      : 'text-gray-700 hover:bg-gray-100',
                    isCollapsed && 'justify-center'
                  )}
                  title={isCollapsed ? item.label : undefined}
                >
                  <Icon className="h-5 w-5 flex-shrink-0" />
                  {!isCollapsed && <span className="text-sm font-medium">{item.label}</span>}
                </Link>
              </li>
            );
          })}
        </ul>
      </nav>

      <div className="p-4 border-t border-gray-200">
        <div className={cn('flex items-center gap-3', isCollapsed && 'justify-center')}>
          <div className="h-8 w-8 rounded-full bg-blue-600 flex items-center justify-center text-white text-sm font-medium flex-shrink-0">
            {user?.firstName?.[0]}{user?.lastName?.[0]}
          </div>
          {!isCollapsed && (
            <div className="min-w-0">
              <p className="text-sm font-medium text-gray-900 truncate">
                {user?.firstName} {user?.lastName}
              </p>
              <p className="text-xs text-gray-500 truncate capitalize">{user?.role}</p>
            </div>
          )}
        </div>
      </div>
    </aside>
  );
};
