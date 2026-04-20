import API from '../axios';
import type { ApiResponse, PaginatedResponse, PaginationParams, IPayment, IFeeStructure } from '../types';

export const paymentAPI = {
  getAll: (params?: PaginationParams) =>
    API.get<PaginatedResponse<IPayment>>('/payments', { params }),

  getById: (id: string) =>
    API.get<ApiResponse<IPayment>>(`/payments/${id}`),

  create: (data: Partial<IPayment>) =>
    API.post<ApiResponse<IPayment>>('/payments', data),

  updateStatus: (id: string, status: IPayment['status']) =>
    API.put<ApiResponse<IPayment>>(`/payments/${id}/status`, { status }),

  getFeeStructures: () =>
    API.get<ApiResponse<IFeeStructure[]>>('/payments/fee-structures'),

  createFeeStructure: (data: Partial<IFeeStructure>) =>
    API.post<ApiResponse<IFeeStructure>>('/payments/fee-structures', data),

  generateInvoice: (studentId: string, feeStructureId: string) =>
    API.post<ApiResponse<IPayment>>('/payments/generate-invoice', { studentId, feeStructureId }),
};
