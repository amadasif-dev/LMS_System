import API from '../axios';
import type { ApiResponse, PaginatedResponse, PaginationParams, ICourse } from '../types';

export const courseAPI = {
  getAll: (params?: PaginationParams) =>
    API.get<PaginatedResponse<ICourse>>('/courses', { params }),

  getById: (id: string) =>
    API.get<ApiResponse<ICourse>>(`/courses/${id}`),

  create: (data: Partial<ICourse>) =>
    API.post<ApiResponse<ICourse>>('/courses', data),

  update: (id: string, data: Partial<ICourse>) =>
    API.put<ApiResponse<ICourse>>(`/courses/${id}`, data),

  delete: (id: string) =>
    API.delete<ApiResponse<null>>(`/courses/${id}`),

  enroll: (courseId: string) =>
    API.post<ApiResponse<null>>(`/courses/${courseId}/enroll`),

  getProgress: (courseId: string) =>
    API.get<ApiResponse<{ progress: number; lastWatched: string }>>(`/courses/${courseId}/progress`),

  updateProgress: (courseId: string, data: { lessonId: string; timestamp: number }) =>
    API.put<ApiResponse<null>>(`/courses/${courseId}/progress`, data),
};
