import { createSlice, createAsyncThunk, type PayloadAction } from '@reduxjs/toolkit';
import type { IUser } from '../../api/types';
import { teacherAPI } from '../../api/endpoints/teachers';

interface TeacherState {
  teachers: IUser[];
  currentTeacher: IUser | null;
  total: number;
  pages: number;
  page: number;
  loading: boolean;
  error: string | null;
}

const initialState: TeacherState = {
  teachers: [],
  currentTeacher: null,
  total: 0,
  pages: 0,
  page: 1,
  loading: false,
  error: null,
};

export const fetchTeachers = createAsyncThunk(
  'teachers/fetchAll',
  async (params?: { page?: number; limit?: number; search?: string }) => {
    const { data } = await teacherAPI.getAll(params);
    return data;
  }
);

export const fetchTeacherById = createAsyncThunk(
  'teachers/fetchById',
  async (id: string) => {
    const { data } = await teacherAPI.getById(id);
    return data.data;
  }
);

export const createTeacher = createAsyncThunk(
  'teachers/create',
  async (teacherData: Partial<IUser> & { password: string }) => {
    const { data } = await teacherAPI.create(teacherData);
    return data.data;
  }
);

export const updateTeacher = createAsyncThunk(
  'teachers/update',
  async ({ id, data }: { id: string; data: Partial<IUser> }) => {
    const { data: response } = await teacherAPI.update(id, data);
    return response.data;
  }
);

export const deleteTeacher = createAsyncThunk(
  'teachers/delete',
  async (id: string) => {
    await teacherAPI.delete(id);
    return id;
  }
);

const teacherSlice = createSlice({
  name: 'teachers',
  initialState,
  reducers: {
    setCurrentTeacher: (state, action: PayloadAction<IUser | null>) => {
      state.currentTeacher = action.payload;
    },
    clearError: (state) => {
      state.error = null;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchTeachers.pending, (state) => {
        state.loading = true;
      })
      .addCase(fetchTeachers.fulfilled, (state, action) => {
        state.loading = false;
        state.teachers = action.payload.data;
        state.total = action.payload.total;
        state.pages = action.payload.pages;
        state.page = action.payload.page;
      })
      .addCase(fetchTeachers.rejected, (state) => {
        state.loading = false;
        state.error = 'Failed to fetch teachers';
      })
      .addCase(fetchTeacherById.fulfilled, (state, action) => {
        state.currentTeacher = action.payload;
      })
      .addCase(createTeacher.fulfilled, (state, action) => {
        state.teachers.unshift(action.payload);
        state.total += 1;
      })
      .addCase(updateTeacher.fulfilled, (state, action) => {
        const index = state.teachers.findIndex((t) => t._id === action.payload._id);
        if (index !== -1) {
          state.teachers[index] = action.payload;
        }
      })
      .addCase(deleteTeacher.fulfilled, (state, action) => {
        state.teachers = state.teachers.filter((t) => t._id !== action.payload);
        state.total -= 1;
      });
  },
});

export const { setCurrentTeacher, clearError } = teacherSlice.actions;
export default teacherSlice.reducer;
