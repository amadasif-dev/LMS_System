import API from '../axios';
import type { ApiResponse, PaginatedResponse, PaginationParams, IAssignment, ISubmission } from '../types';

export const assignmentAPI = {
  getAll: (params?: PaginationParams) =>
    API.get<PaginatedResponse<IAssignment>>('/assignments', { params }),

  getById: (id: string) =>
    API.get<ApiResponse<IAssignment>>(`/assignments/${id}`),

  create: (data: Partial<IAssignment>) =>
    API.post<ApiResponse<IAssignment>>('/assignments', data),

  update: (id: string, data: Partial<IAssignment>) =>
    API.put<ApiResponse<IAssignment>>(`/assignments/${id}`, data),

  delete: (id: string) =>
    API.delete<ApiResponse<null>>(`/assignments/${id}`),

  submit: (assignmentId: string, data: { content: string; files?: string[] }) =>
    API.post<ApiResponse<ISubmission>>(`/assignments/${assignmentId}/submit`, data),

  grade: (assignmentId: string, submissionId: string, data: { grade: number; feedback?: string }) =>
    API.put<ApiResponse<ISubmission>>(`/assignments/${assignmentId}/submissions/${submissionId}/grade`, data),

  getSubmissions: (assignmentId: string) =>
    API.get<ApiResponse<ISubmission[]>>(`/assignments/${assignmentId}/submissions`),
};
