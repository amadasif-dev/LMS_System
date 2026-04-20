import { useEffect } from 'react';
import { useAppDispatch, useAppSelector } from '../../core/store/hooks';
import { fetchDashboardStats } from '../../core/store/slices/analyticsSlice';
import { Card } from '../../shared/components/Card/Card';
import { Loader } from '../../shared/components/Loader/Loader';
import { Users, BookOpen, GraduationCap, TrendingUp } from 'lucide-react';

export const DashboardPage = () => {
  const dispatch = useAppDispatch();
  const { user } = useAppSelector((state) => state.auth);
  const { dashboardStats, loading } = useAppSelector((state) => state.analytics);

  useEffect(() => {
    dispatch(fetchDashboardStats());
  }, [dispatch]);

  if (loading) return <Loader fullScreen />;

  const stats = [
    { label: 'Total Students', value: dashboardStats?.students || 0, icon: Users, color: 'blue' },
    { label: 'Total Courses', value: dashboardStats?.courses || 0, icon: BookOpen, color: 'green' },
    { label: 'Active Enrollments', value: dashboardStats?.activeEnrollments || 0, icon: GraduationCap, color: 'purple' },
    { label: 'Avg. Attendance', value: `${dashboardStats?.averageAttendance || 0}%`, icon: TrendingUp, color: 'orange' },
  ];

  const getGreeting = () => {
    const hour = new Date().getHours();
    if (hour < 12) return 'Good morning';
    if (hour < 18) return 'Good afternoon';
    return 'Good evening';
  };

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-gray-900">
          {getGreeting()}, {user?.firstName}!
        </h1>
        <p className="text-gray-600">Here's what's happening today</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {stats.map((stat) => (
          <Card key={stat.label} className="p-6">
            <div className="flex items-center">
              <div className={`p-3 rounded-lg bg-${stat.color}-100`}>
                <stat.icon className={`h-6 w-6 text-${stat.color}-600`} />
              </div>
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-600">{stat.label}</p>
                <p className="text-2xl font-bold text-gray-900">{stat.value}</p>
              </div>
            </div>
          </Card>
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <Card title="Recent Activity" className="p-6">
          <p className="text-gray-500">No recent activity to display</p>
        </Card>
        <Card title="Quick Actions" className="p-6">
          <div className="space-y-2">
            <p className="text-gray-500">Quick actions will appear here</p>
          </div>
        </Card>
      </div>
    </div>
  );
};
