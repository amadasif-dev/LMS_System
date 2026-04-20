import { createSlice, createAsyncThunk, type PayloadAction } from '@reduxjs/toolkit';
import type { DashboardStats } from '../../api/types';
import { analyticsAPI } from '../../api/endpoints/analytics';

interface AnalyticsState {
  dashboardStats: DashboardStats | null;
  enrollmentTrends: unknown[];
  attendanceStats: unknown[];
  completionRates: unknown[];
  revenueData: unknown | null;
  loading: boolean;
  error: string | null;
}

const initialState: AnalyticsState = {
  dashboardStats: null,
  enrollmentTrends: [],
  attendanceStats: [],
  completionRates: [],
  revenueData: null,
  loading: false,
  error: null,
};

export const fetchDashboardStats = createAsyncThunk(
  'analytics/fetchDashboardStats',
  async () => {
    const { data } = await analyticsAPI.getDashboardStats();
    return data.data;
  }
);

export const fetchEnrollmentTrends = createAsyncThunk(
  'analytics/fetchEnrollmentTrends',
  async (params?: { months?: number }) => {
    const { data } = await analyticsAPI.getEnrollmentTrends(params);
    return data.data;
  }
);

export const fetchAttendanceStats = createAsyncThunk(
  'analytics/fetchAttendanceStats',
  async (params?: { courseId?: string; month?: number; year?: number }) => {
    const { data } = await analyticsAPI.getAttendanceStats(params);
    return data.data;
  }
);

export const fetchCompletionRates = createAsyncThunk(
  'analytics/fetchCompletionRates',
  async (params?: { courseId?: string }) => {
    const { data } = await analyticsAPI.getCompletionRates(params);
    return data.data;
  }
);

const analyticsSlice = createSlice({
  name: 'analytics',
  initialState,
  reducers: {
    clearError: (state) => {
      state.error = null;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchDashboardStats.pending, (state) => {
        state.loading = true;
      })
      .addCase(fetchDashboardStats.fulfilled, (state, action) => {
        state.loading = false;
        state.dashboardStats = action.payload;
      })
      .addCase(fetchDashboardStats.rejected, (state) => {
        state.loading = false;
        state.error = 'Failed to fetch dashboard stats';
      })
      .addCase(fetchEnrollmentTrends.fulfilled, (state, action) => {
        state.enrollmentTrends = action.payload;
      })
      .addCase(fetchAttendanceStats.fulfilled, (state, action) => {
        state.attendanceStats = action.payload;
      })
      .addCase(fetchCompletionRates.fulfilled, (state, action) => {
        state.completionRates = action.payload;
      });
  },
});

export const { clearError } = analyticsSlice.actions;
export default analyticsSlice.reducer;
