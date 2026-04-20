import API from '../axios';
import type { ApiResponse, PaginatedResponse, PaginationParams, IUser } from '../types';

export const studentAPI = {
  getAll: (params?: PaginationParams) =>
    API.get<PaginatedResponse<IUser>>('/students', { params }),

  getById: (id: string) =>
    API.get<ApiResponse<IUser>>(`/students/${id}`),

  create: (data: Partial<IUser> & { password: string }) =>
    API.post<ApiResponse<IUser>>('/students', data),

  update: (id: string, data: Partial<IUser>) =>
    API.put<ApiResponse<IUser>>(`/students/${id}`, data),

  delete: (id: string) =>
    API.delete<ApiResponse<null>>(`/students/${id}`),
};
