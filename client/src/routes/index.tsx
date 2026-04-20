import { Suspense, lazy } from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';
import { ProtectedRoute } from '../core/guards/ProtectedRoute';
import { RoleGuard } from '../core/guards/RoleGuard';
import { AuthLayout, AdminLayout } from '../shared/layouts';
import { Loader } from '../shared/components/Loader/Loader';

// Lazy load pages for code splitting
const LoginPage = lazy(() => import('../features/auth/pages/LoginPage').then(m => ({ default: m.LoginPage })));
const ForgotPasswordPage = lazy(() => import('../features/auth/pages/ForgotPasswordPage').then(m => ({ default: m.ForgotPasswordPage })));
const DashboardPage = lazy(() => import('../features/dashboard/DashboardPage').then(m => ({ default: m.DashboardPage })));
const AdminDashboard = lazy(() => import('../features/admin/pages/AdminDashboard').then(m => ({ default: m.AdminDashboard })));
const CourseList = lazy(() => import('../features/courses/pages/CourseList').then(m => ({ default: m.CourseList })));
const StudentList = lazy(() => import('../features/students/pages/StudentList').then(m => ({ default: m.StudentList })));
const TeacherList = lazy(() => import('../features/teachers/pages/TeacherList').then(m => ({ default: m.TeacherList })));
const QuizList = lazy(() => import('../features/quizzes/pages/QuizList').then(m => ({ default: m.QuizList })));
const AssignmentList = lazy(() => import('../features/assignments/pages/AssignmentList').then(m => ({ default: m.AssignmentList })));
const AttendanceSheet = lazy(() => import('../features/attendance/pages/AttendanceSheet').then(m => ({ default: m.AttendanceSheet })));
const TimetableCalendar = lazy(() => import('../features/timetable/pages/TimetableCalendar').then(m => ({ default: m.TimetableCalendar })));
const AnalyticsDashboard = lazy(() => import('../features/analytics/pages/AnalyticsDashboard').then(m => ({ default: m.AnalyticsDashboard })));
const PaymentList = lazy(() => import('../features/payments/pages/PaymentList').then(m => ({ default: m.PaymentList })));
const CertificateViewer = lazy(() => import('../features/certificates/pages/CertificateViewer').then(m => ({ default: m.CertificateViewer })));
const ChatRoom = lazy(() => import('../features/chat/pages/ChatRoom').then(m => ({ default: m.ChatRoom })));
const SettingsPage = lazy(() => import('../features/settings/pages/SettingsPage').then(m => ({ default: m.SettingsPage })));
const UnauthorizedPage = lazy(() => import('../features/common/UnauthorizedPage').then(m => ({ default: m.UnauthorizedPage })));
const NotFoundPage = lazy(() => import('../features/common/NotFoundPage').then(m => ({ default: m.NotFoundPage })));

const PageWrapper = ({ children }: { children: React.ReactNode }) => (
  <Suspense fallback={<Loader fullScreen />}>{children}</Suspense>
);

export const AppRoutes = () => {
  return (
    <Routes>
      {/* Public Routes */}
      <Route element={<AuthLayout />}>
        <Route path="/login" element={<PageWrapper><LoginPage /></PageWrapper>} />
        <Route path="/forgot-password" element={<PageWrapper><ForgotPasswordPage /></PageWrapper>} />
      </Route>

      <Route path="/unauthorized" element={<PageWrapper><UnauthorizedPage /></PageWrapper>} />

      {/* Protected Routes */}
      <Route element={<ProtectedRoute />}>
        <Route element={<AdminLayout />}>
          {/* Common Dashboard */}
          <Route path="/dashboard" element={<PageWrapper><DashboardPage /></PageWrapper>} />

          {/* Super Admin Only */}
          <Route element={<RoleGuard allowedRoles={['super_admin']} />}>
            <Route path="/admin/dashboard" element={<PageWrapper><AdminDashboard /></PageWrapper>} />
          </Route>

          {/* School Admin & Teacher */}
          <Route element={<RoleGuard allowedRoles={['school_admin', 'teacher']} />}>
            <Route path="/courses" element={<PageWrapper><CourseList /></PageWrapper>} />
            <Route path="/students" element={<PageWrapper><StudentList /></PageWrapper>} />
            <Route path="/quizzes" element={<PageWrapper><QuizList /></PageWrapper>} />
            <Route path="/assignments" element={<PageWrapper><AssignmentList /></PageWrapper>} />
            <Route path="/attendance" element={<PageWrapper><AttendanceSheet /></PageWrapper>} />
            <Route path="/timetable" element={<PageWrapper><TimetableCalendar /></PageWrapper>} />
            <Route path="/analytics" element={<PageWrapper><AnalyticsDashboard /></PageWrapper>} />
          </Route>

          {/* School Admin Only */}
          <Route element={<RoleGuard allowedRoles={['school_admin']} />}>
            <Route path="/teachers" element={<PageWrapper><TeacherList /></PageWrapper>} />
            <Route path="/payments" element={<PageWrapper><PaymentList /></PageWrapper>} />
          </Route>

          {/* All authenticated users */}
          <Route path="/chat" element={<PageWrapper><ChatRoom /></PageWrapper>} />
          <Route path="/certificates" element={<PageWrapper><CertificateViewer /></PageWrapper>} />
          <Route path="/settings" element={<PageWrapper><SettingsPage /></PageWrapper>} />
        </Route>
      </Route>

      {/* Redirect root to dashboard */}
      <Route path="/" element={<Navigate to="/dashboard" replace />} />

      {/* 404 */}
      <Route path="*" element={<PageWrapper><NotFoundPage /></PageWrapper>} />
    </Routes>
  );
};
