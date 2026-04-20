import API from '../axios';
import type { ApiResponse, DashboardStats } from '../types';

export const analyticsAPI = {
  getDashboardStats: () =>
    API.get<ApiResponse<DashboardStats>>('/analytics/dashboard'),

  getEnrollmentTrends: (params?: { months?: number }) =>
    API.get<ApiResponse<unknown[]>>('/analytics/enrollment-trends', { params }),

  getAttendanceStats: (params?: { courseId?: string; month?: number; year?: number }) =>
    API.get<ApiResponse<unknown[]>>('/analytics/attendance-stats', { params }),

  getCompletionRates: (params?: { courseId?: string }) =>
    API.get<ApiResponse<unknown[]>>('/analytics/completion-rates', { params }),

  getStudentPerformance: (studentId: string) =>
    API.get<ApiResponse<unknown>>(`/analytics/student-performance/${studentId}`),

  getRevenueAnalytics: (params?: { startDate?: string; endDate?: string }) =>
    API.get<ApiResponse<unknown>>('/analytics/revenue', { params }),
};
