import { useEffect } from 'react';
import { useAppDispatch, useAppSelector } from '../../../core/store/hooks';
import { fetchDashboardStats } from '../../../core/store/slices/analyticsSlice';
import { Card } from '../../../shared/components/Card/Card';
import { Loader } from '../../../shared/components/Loader/Loader';
import { Users, GraduationCap, School, DollarSign } from 'lucide-react';

export const AdminDashboard = () => {
  const dispatch = useAppDispatch();
  const { dashboardStats, loading } = useAppSelector((state) => state.analytics);

  useEffect(() => {
    dispatch(fetchDashboardStats());
  }, [dispatch]);

  if (loading) return <Loader fullScreen />;

  const stats = [
    { label: 'Total Schools', value: dashboardStats?.courses || 0, icon: School, color: 'blue' },
    { label: 'Total Students', value: dashboardStats?.students || 0, icon: Users, color: 'green' },
    { label: 'Total Teachers', value: dashboardStats?.teachers || 0, icon: GraduationCap, color: 'purple' },
    { label: 'Revenue', value: `$${dashboardStats?.revenue || 0}`, icon: DollarSign, color: 'orange' },
  ];

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-gray-900">Super Admin Dashboard</h1>
        <p className="text-gray-600">Platform-wide overview and management</p>
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
    </div>
  );
};
