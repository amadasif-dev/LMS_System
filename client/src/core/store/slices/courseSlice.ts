import { createSlice, createAsyncThunk, type PayloadAction } from '@reduxjs/toolkit';
import type { ICourse } from '../../api/types';
import { courseAPI } from '../../api/endpoints/courses';

interface CourseState {
  courses: ICourse[];
  currentCourse: ICourse | null;
  total: number;
  pages: number;
  page: number;
  loading: boolean;
  error: string | null;
}

const initialState: CourseState = {
  courses: [],
  currentCourse: null,
  total: 0,
  pages: 0,
  page: 1,
  loading: false,
  error: null,
};

export const fetchCourses = createAsyncThunk(
  'courses/fetchAll',
  async (params?: { page?: number; limit?: number; search?: string }) => {
    const { data } = await courseAPI.getAll(params);
    return data;
  }
);

export const fetchCourseById = createAsyncThunk(
  'courses/fetchById',
  async (id: string) => {
    const { data } = await courseAPI.getById(id);
    return data.data;
  }
);

export const createCourse = createAsyncThunk(
  'courses/create',
  async (courseData: Partial<ICourse>) => {
    const { data } = await courseAPI.create(courseData);
    return data.data;
  }
);

export const updateCourse = createAsyncThunk(
  'courses/update',
  async ({ id, data }: { id: string; data: Partial<ICourse> }) => {
    const { data: response } = await courseAPI.update(id, data);
    return response.data;
  }
);

export const deleteCourse = createAsyncThunk(
  'courses/delete',
  async (id: string) => {
    await courseAPI.delete(id);
    return id;
  }
);

export const enrollInCourse = createAsyncThunk(
  'courses/enroll',
  async (courseId: string) => {
    await courseAPI.enroll(courseId);
    return courseId;
  }
);

const courseSlice = createSlice({
  name: 'courses',
  initialState,
  reducers: {
    setCurrentCourse: (state, action: PayloadAction<ICourse | null>) => {
      state.currentCourse = action.payload;
    },
    clearError: (state) => {
      state.error = null;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchCourses.pending, (state) => {
        state.loading = true;
      })
      .addCase(fetchCourses.fulfilled, (state, action) => {
        state.loading = false;
        state.courses = action.payload.data;
        state.total = action.payload.total;
        state.pages = action.payload.pages;
        state.page = action.payload.page;
      })
      .addCase(fetchCourses.rejected, (state) => {
        state.loading = false;
        state.error = 'Failed to fetch courses';
      })
      .addCase(fetchCourseById.fulfilled, (state, action) => {
        state.currentCourse = action.payload;
      })
      .addCase(createCourse.fulfilled, (state, action) => {
        state.courses.unshift(action.payload);
        state.total += 1;
      })
      .addCase(updateCourse.fulfilled, (state, action) => {
        const index = state.courses.findIndex((c) => c._id === action.payload._id);
        if (index !== -1) {
          state.courses[index] = action.payload;
        }
        if (state.currentCourse?._id === action.payload._id) {
          state.currentCourse = action.payload;
        }
      })
      .addCase(deleteCourse.fulfilled, (state, action) => {
        state.courses = state.courses.filter((c) => c._id !== action.payload);
        state.total -= 1;
      });
  },
});

export const { setCurrentCourse, clearError } = courseSlice.actions;
export default courseSlice.reducer;
