import { createSlice, createAsyncThunk, type PayloadAction } from '@reduxjs/toolkit';
import type { IPayment, IFeeStructure } from '../../api/types';
import { paymentAPI } from '../../api/endpoints/payments';

interface PaymentState {
  payments: IPayment[];
  feeStructures: IFeeStructure[];
  total: number;
  pages: number;
  page: number;
  loading: boolean;
  error: string | null;
}

const initialState: PaymentState = {
  payments: [],
  feeStructures: [],
  total: 0,
  pages: 0,
  page: 1,
  loading: false,
  error: null,
};

export const fetchPayments = createAsyncThunk(
  'payments/fetchAll',
  async (params?: { page?: number; limit?: number; studentId?: string }) => {
    const { data } = await paymentAPI.getAll(params);
    return data;
  }
);

export const fetchFeeStructures = createAsyncThunk(
  'payments/fetchFeeStructures',
  async () => {
    const { data } = await paymentAPI.getFeeStructures();
    return data.data;
  }
);

export const createPayment = createAsyncThunk(
  'payments/create',
  async (paymentData: Partial<IPayment>) => {
    const { data } = await paymentAPI.create(paymentData);
    return data.data;
  }
);

export const createFeeStructure = createAsyncThunk(
  'payments/createFeeStructure',
  async (data: Partial<IFeeStructure>) => {
    const { data: response } = await paymentAPI.createFeeStructure(data);
    return response.data;
  }
);

export const updatePaymentStatus = createAsyncThunk(
  'payments/updateStatus',
  async ({ id, status }: { id: string; status: IPayment['status'] }) => {
    const { data } = await paymentAPI.updateStatus(id, status);
    return data.data;
  }
);

const paymentSlice = createSlice({
  name: 'payments',
  initialState,
  reducers: {
    clearError: (state) => {
      state.error = null;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchPayments.pending, (state) => {
        state.loading = true;
      })
      .addCase(fetchPayments.fulfilled, (state, action) => {
        state.loading = false;
        state.payments = action.payload.data;
        state.total = action.payload.total;
        state.pages = action.payload.pages;
        state.page = action.payload.page;
      })
      .addCase(fetchPayments.rejected, (state) => {
        state.loading = false;
        state.error = 'Failed to fetch payments';
      })
      .addCase(fetchFeeStructures.fulfilled, (state, action) => {
        state.feeStructures = action.payload;
      })
      .addCase(createPayment.fulfilled, (state, action) => {
        state.payments.unshift(action.payload);
        state.total += 1;
      })
      .addCase(createFeeStructure.fulfilled, (state, action) => {
        state.feeStructures.push(action.payload);
      })
      .addCase(updatePaymentStatus.fulfilled, (state, action) => {
        const index = state.payments.findIndex((p) => p._id === action.payload._id);
        if (index !== -1) {
          state.payments[index] = action.payload;
        }
      });
  },
});

export const { clearError } = paymentSlice.actions;
export default paymentSlice.reducer;
