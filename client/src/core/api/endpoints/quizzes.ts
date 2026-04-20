import API from '../axios';
import type { ApiResponse, PaginatedResponse, PaginationParams, IQuiz, IQuestion } from '../types';

export const quizAPI = {
  getAll: (params?: PaginationParams) =>
    API.get<PaginatedResponse<IQuiz>>('/quizzes', { params }),

  getById: (id: string) =>
    API.get<ApiResponse<IQuiz>>(`/quizzes/${id}`),

  create: (data: Partial<IQuiz>) =>
    API.post<ApiResponse<IQuiz>>('/quizzes', data),

  update: (id: string, data: Partial<IQuiz>) =>
    API.put<ApiResponse<IQuiz>>(`/quizzes/${id}`, data),

  delete: (id: string) =>
    API.delete<ApiResponse<null>>(`/quizzes/${id}`),

  submit: (quizId: string, answers: { questionId: string; answer: string }[]) =>
    API.post<ApiResponse<{ score: number; totalMarks: number; percentage: number }>>(`/quizzes/${quizId}/submit`, { answers }),

  getResults: (quizId: string) =>
    API.get<ApiResponse<{ results: unknown[]; statistics: unknown }>>(`/quizzes/${quizId}/results`),
};
