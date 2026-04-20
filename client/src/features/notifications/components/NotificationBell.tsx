import { useState, useEffect, useRef } from 'react';
import { Bell } from 'lucide-react';
import { cn, formatDate } from '../../../core/utils/helpers';
import { useAppSelector, useAppDispatch } from '../../../core/store/hooks';
import { fetchNotifications, markAsRead, markAllAsRead } from '../../../core/store/slices/notificationSlice';

export const NotificationBell = () => {
  const [isOpen, setIsOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);
  const dispatch = useAppDispatch();
  const { notifications, unreadCount } = useAppSelector((state) => state.notifications);

  useEffect(() => {
    dispatch(fetchNotifications({}));
  }, [dispatch]);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const handleMarkAsRead = (id: string) => {
    dispatch(markAsRead(id));
  };

  const handleMarkAllAsRead = () => {
    dispatch(markAllAsRead());
  };

  return (
    <div className="relative" ref={dropdownRef}>
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="relative p-2 rounded-lg hover:bg-gray-100 transition-colors"
      >
        <Bell className="h-5 w-5 text-gray-600" />
        {unreadCount > 0 && (
          <span className="absolute top-1 right-1 h-4 w-4 bg-red-500 text-white text-xs rounded-full flex items-center justify-center">
            {unreadCount > 9 ? '9+' : unreadCount}
          </span>
        )}
      </button>

      {isOpen && (
        <div className="absolute right-0 mt-2 w-80 bg-white rounded-xl shadow-lg border border-gray-200 z-50">
          <div className="flex items-center justify-between px-4 py-3 border-b border-gray-100">
            <h3 className="font-semibold text-gray-900">Notifications</h3>
            {unreadCount > 0 && (
              <button
                onClick={handleMarkAllAsRead}
                className="text-sm text-blue-600 hover:text-blue-700"
              >
                Mark all read
              </button>
            )}
          </div>
          <div className="max-h-80 overflow-y-auto">
            {notifications.length === 0 ? (
              <p className="text-center py-8 text-gray-500">No notifications</p>
            ) : (
              notifications.slice(0, 10).map((notification: any) => (
                <div
                  key={notification._id}
                  onClick={() => handleMarkAsRead(notification._id)}
                  className={cn(
                    'px-4 py-3 border-b border-gray-50 cursor-pointer hover:bg-gray-50 transition-colors',
                    !notification.isRead && 'bg-blue-50/50'
                  )}
                >
                  <div className="flex items-start gap-3">
                    <div className={cn(
                      'h-2 w-2 rounded-full mt-2 flex-shrink-0',
                      notification.type === 'success' && 'bg-green-500',
                      notification.type === 'warning' && 'bg-yellow-500',
                      notification.type === 'error' && 'bg-red-500',
                      notification.type === 'info' && 'bg-blue-500'
                    )} />
                    <div className="flex-1 min-w-0">
                      <p className="font-medium text-sm text-gray-900">{notification.title}</p>
                      <p className="text-sm text-gray-500 truncate">{notification.message}</p>
                      <p className="text-xs text-gray-400 mt-1">{formatDate(notification.createdAt)}</p>
                    </div>
                    {!notification.isRead && (
                      <span className="h-2 w-2 bg-blue-600 rounded-full flex-shrink-0" />
                    )}
                  </div>
                </div>
              ))
            )}
          </div>
        </div>
      )}
    </div>
  );
};
