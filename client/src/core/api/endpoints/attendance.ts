import API from '../axios';
import type { ApiResponse, PaginatedResponse, PaginationParams, IAttendance } from '../types';

export const attendanceAPI = {
  getAll: (params?: PaginationParams) =>
    API.get<PaginatedResponse<IAttendance>>('/attendance', { params }),

  getByCourse: (courseId: string, params?: { date?: string; month?: string; year?: string }) =>
    API.get<ApiResponse<IAttendance[]>>(`/attendance/course/${courseId}`, { params }),

  getByStudent: (studentId: string, params?: { month?: string; year?: string }) =>
    API.get<ApiResponse<{ records: IAttendance[]; stats: { present: number; absent: number; late: number } }>>(`/attendance/student/${studentId}`, { params }),

  mark: (data: { courseId: string; studentId: string; date: string; status: 'present' | 'absent' | 'late' }) =>
    API.post<ApiResponse<IAttendance>>('/attendance/mark', data),

  bulkMark: (courseId: string, date: string, records: { studentId: string; status: 'present' | 'absent' | 'late' }[]) =>
    API.post<ApiResponse<IAttendance[]>>('/attendance/bulk-mark', { courseId, date, records }),

  getReport: (courseId: string, startDate: string, endDate: string) =>
    API.get<ApiResponse<unknown>>(`/attendance/report/${courseId}`, { params: { startDate, endDate } }),
};
