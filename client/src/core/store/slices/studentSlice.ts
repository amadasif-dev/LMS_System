import { createSlice, createAsyncThunk, type PayloadAction } from '@reduxjs/toolkit';
import type { IUser } from '../../api/types';
import { studentAPI } from '../../api/endpoints/students';

interface StudentState {
  students: IUser[];
  currentStudent: IUser | null;
  total: number;
  pages: number;
  page: number;
  loading: boolean;
  error: string | null;
}

const initialState: StudentState = {
  students: [],
  currentStudent: null,
  total: 0,
  pages: 0,
  page: 1,
  loading: false,
  error: null,
};

export const fetchStudents = createAsyncThunk(
  'students/fetchAll',
  async (params?: { page?: number; limit?: number; search?: string }) => {
    const { data } = await studentAPI.getAll(params);
    return data;
  }
);

export const fetchStudentById = createAsyncThunk(
  'students/fetchById',
  async (id: string) => {
    const { data } = await studentAPI.getById(id);
    return data.data;
  }
);

export const createStudent = createAsyncThunk(
  'students/create',
  async (studentData: Partial<IUser> & { password: string }) => {
    const { data } = await studentAPI.create(studentData);
    return data.data;
  }
);

export const updateStudent = createAsyncThunk(
  'students/update',
  async ({ id, data }: { id: string; data: Partial<IUser> }) => {
    const { data: response } = await studentAPI.update(id, data);
    return response.data;
  }
);

export const deleteStudent = createAsyncThunk(
  'students/delete',
  async (id: string) => {
    await studentAPI.delete(id);
    return id;
  }
);

const studentSlice = createSlice({
  name: 'students',
  initialState,
  reducers: {
    setCurrentStudent: (state, action: PayloadAction<IUser | null>) => {
      state.currentStudent = action.payload;
    },
    clearError: (state) => {
      state.error = null;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchStudents.pending, (state) => {
        state.loading = true;
      })
      .addCase(fetchStudents.fulfilled, (state, action) => {
        state.loading = false;
        state.students = action.payload.data;
        state.total = action.payload.total;
        state.pages = action.payload.pages;
        state.page = action.payload.page;
      })
      .addCase(fetchStudents.rejected, (state) => {
        state.loading = false;
        state.error = 'Failed to fetch students';
      })
      .addCase(fetchStudentById.fulfilled, (state, action) => {
        state.currentStudent = action.payload;
      })
      .addCase(createStudent.fulfilled, (state, action) => {
        state.students.unshift(action.payload);
        state.total += 1;
      })
      .addCase(updateStudent.fulfilled, (state, action) => {
        const index = state.students.findIndex((s) => s._id === action.payload._id);
        if (index !== -1) {
          state.students[index] = action.payload;
        }
      })
      .addCase(deleteStudent.fulfilled, (state, action) => {
        state.students = state.students.filter((s) => s._id !== action.payload);
        state.total -= 1;
      });
  },
});

export const { setCurrentStudent, clearError } = studentSlice.actions;
export default studentSlice.reducer;
