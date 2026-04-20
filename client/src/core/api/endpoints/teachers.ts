import API from '../axios';
import type { ApiResponse, PaginatedResponse, PaginationParams, IUser } from '../types';

export const teacherAPI = {
  getAll: (params?: PaginationParams) =>
    API.get<PaginatedResponse<IUser>>('/teachers', { params }),

  getById: (id: string) =>
    API.get<ApiResponse<IUser>>(`/teachers/${id}`),

  create: (data: Partial<IUser> & { password: string }) =>
    API.post<ApiResponse<IUser>>('/teachers', data),

  update: (id: string, data: Partial<IUser>) =>
    API.put<ApiResponse<IUser>>(`/teachers/${id}`, data),

  delete: (id: string) =>
    API.delete<ApiResponse<null>>(`/teachers/${id}`),
};
