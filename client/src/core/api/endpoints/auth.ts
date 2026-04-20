import API from '../axios';
import type { ApiResponse, IUser, IAuthTokens } from '../types';

export const authAPI = {
  login: (data: { email: string; password: string }) =>
    API.post<ApiResponse<{ user: IUser } & IAuthTokens>>('/auth/login', data),

  register: (data: { firstName: string; lastName: string; email: string; password: string; role: string; tenantId: string }) =>
    API.post<ApiResponse<{ user: IUser } & IAuthTokens>>('/auth/register', data),

  getMe: () => API.get<ApiResponse<IUser>>('/auth/me'),

  refreshToken: (refreshToken: string) =>
    API.post<ApiResponse<IAuthTokens>>('/auth/refresh-token', { refreshToken }),

  forgotPassword: (email: string) =>
    API.post<ApiResponse<{ message: string }>>('/auth/forgot-password', { email }),

  resetPassword: (data: { token: string; password: string }) =>
    API.post<ApiResponse<{ message: string }>>('/auth/reset-password', data),

  logout: () => API.post('/auth/logout'),
};
