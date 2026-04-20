import { useEffect } from 'react';
import { useAppDispatch, useAppSelector } from '../../../core/store/hooks';
import {
  fetchDashboardStats,
  fetchEnrollmentTrends,
  fetchAttendanceStats,
  fetchCompletionRates,
} from '../../../core/store/slices/analyticsSlice';
import { Card } from '../../../shared/components/Card/Card';
import { Loader } from '../../../shared/components/Loader/Loader';
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  BarElement,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend,
  ArcElement,
} from 'chart.js';
import { Bar, Line, Doughnut } from 'react-chartjs-2';

ChartJS.register(
  CategoryScale,
  LinearScale,
  BarElement,
  PointElement,
  LineElement,
  ArcElement,
  Title,
  Tooltip,
  Legend
);

export const AnalyticsDashboard = () => {
  const dispatch = useAppDispatch();
  const { dashboardStats, enrollmentTrends, attendanceStats, completionRates, loading } =
    useAppSelector((state) => state.analytics);

  useEffect(() => {
    dispatch(fetchDashboardStats());
    dispatch(fetchEnrollmentTrends({}));
    dispatch(fetchAttendanceStats({}));
    dispatch(fetchCompletionRates({}));
  }, [dispatch]);

  const enrollmentData = {
    labels: enrollmentTrends.map((t: any) => t.month || ''),
    datasets: [
      {
        label: 'Enrollments',
        data: enrollmentTrends.map((t: any) => t.count || 0),
        backgroundColor: 'rgba(59, 130, 246, 0.5)',
        borderColor: 'rgba(59, 130, 246, 1)',
        borderWidth: 1,
      },
    ],
  };

  const attendanceData = {
    labels: ['Present', 'Absent', 'Late'],
    datasets: [
      {
        data: [65, 20, 15],
        backgroundColor: [
          'rgba(34, 197, 94, 0.5)',
          'rgba(239, 68, 68, 0.5)',
          'rgba(234, 179, 8, 0.5)',
        ],
        borderColor: [
          'rgba(34, 197, 94, 1)',
          'rgba(239, 68, 68, 1)',
          'rgba(234, 179, 8, 1)',
        ],
        borderWidth: 1,
      },
    ],
  };

  if (loading) return <Loader fullScreen />;

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-gray-900">Analytics Dashboard</h1>
        <p className="text-gray-600">Performance metrics and insights</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <Card className="p-6">
          <p className="text-sm text-gray-600">Total Students</p>
          <p className="text-3xl font-bold text-gray-900">{dashboardStats?.students || 0}</p>
        </Card>
        <Card className="p-6">
          <p className="text-sm text-gray-600">Active Courses</p>
          <p className="text-3xl font-bold text-gray-900">{dashboardStats?.courses || 0}</p>
        </Card>
        <Card className="p-6">
          <p className="text-sm text-gray-600">Avg. Attendance</p>
          <p className="text-3xl font-bold text-gray-900">{dashboardStats?.averageAttendance || 0}%</p>
        </Card>
        <Card className="p-6">
          <p className="text-sm text-gray-600">Revenue</p>
          <p className="text-3xl font-bold text-gray-900">${dashboardStats?.revenue || 0}</p>
        </Card>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <Card title="Enrollment Trends" className="p-6">
          <Bar data={enrollmentData} />
        </Card>
        <Card title="Attendance Overview" className="p-6">
          <Doughnut data={attendanceData} />
        </Card>
      </div>
    </div>
  );
};
