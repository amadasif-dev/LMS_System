import { createSlice, createAsyncThunk, type PayloadAction } from '@reduxjs/toolkit';
import type { IAttendance } from '../../api/types';
import { attendanceAPI } from '../../api/endpoints/attendance';

interface AttendanceState {
  records: IAttendance[];
  report: unknown | null;
  total: number;
  pages: number;
  page: number;
  loading: boolean;
  error: string | null;
}

const initialState: AttendanceState = {
  records: [],
  report: null,
  total: 0,
  pages: 0,
  page: 1,
  loading: false,
  error: null,
};

export const fetchAttendance = createAsyncThunk(
  'attendance/fetchAll',
  async (params?: { page?: number; limit?: number; courseId?: string; date?: string }) => {
    const { data } = await attendanceAPI.getAll(params);
    return data;
  }
);

export const fetchAttendanceByCourse = createAsyncThunk(
  'attendance/fetchByCourse',
  async ({ courseId, params }: { courseId: string; params?: { date?: string; month?: string; year?: string } }) => {
    const { data } = await attendanceAPI.getByCourse(courseId, params);
    return data.data;
  }
);

export const markAttendance = createAsyncThunk(
  'attendance/mark',
  async (data: { courseId: string; studentId: string; date: string; status: 'present' | 'absent' | 'late' }) => {
    const { data: response } = await attendanceAPI.mark(data);
    return response.data;
  }
);

export const bulkMarkAttendance = createAsyncThunk(
  'attendance/bulkMark',
  async ({ courseId, date, records }: { courseId: string; date: string; records: { studentId: string; status: 'present' | 'absent' | 'late' }[] }) => {
    const { data } = await attendanceAPI.bulkMark(courseId, date, records);
    return data.data;
  }
);

export const fetchAttendanceReport = createAsyncThunk(
  'attendance/fetchReport',
  async ({ courseId, startDate, endDate }: { courseId: string; startDate: string; endDate: string }) => {
    const { data } = await attendanceAPI.getReport(courseId, startDate, endDate);
    return data.data;
  }
);

const attendanceSlice = createSlice({
  name: 'attendance',
  initialState,
  reducers: {
    clearError: (state) => {
      state.error = null;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchAttendance.pending, (state) => {
        state.loading = true;
      })
      .addCase(fetchAttendance.fulfilled, (state, action) => {
        state.loading = false;
        state.records = action.payload.data;
        state.total = action.payload.total;
        state.pages = action.payload.pages;
        state.page = action.payload.page;
      })
      .addCase(fetchAttendance.rejected, (state) => {
        state.loading = false;
        state.error = 'Failed to fetch attendance';
      })
      .addCase(fetchAttendanceByCourse.fulfilled, (state, action) => {
        state.records = action.payload;
      })
      .addCase(markAttendance.fulfilled, (state, action) => {
        state.records.unshift(action.payload);
        state.total += 1;
      })
      .addCase(bulkMarkAttendance.fulfilled, (state, action) => {
        state.records = [...action.payload, ...state.records];
        state.total += action.payload.length;
      })
      .addCase(fetchAttendanceReport.fulfilled, (state, action) => {
        state.report = action.payload;
      });
  },
});

export const { clearError } = attendanceSlice.actions;
export default attendanceSlice.reducer;
