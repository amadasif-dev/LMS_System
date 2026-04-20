import { createSlice, createAsyncThunk, type PayloadAction } from '@reduxjs/toolkit';
import type { IQuiz } from '../../api/types';
import { quizAPI } from '../../api/endpoints/quizzes';

interface QuizState {
  quizzes: IQuiz[];
  currentQuiz: IQuiz | null;
  total: number;
  pages: number;
  page: number;
  loading: boolean;
  error: string | null;
}

const initialState: QuizState = {
  quizzes: [],
  currentQuiz: null,
  total: 0,
  pages: 0,
  page: 1,
  loading: false,
  error: null,
};

export const fetchQuizzes = createAsyncThunk(
  'quizzes/fetchAll',
  async (params?: { page?: number; limit?: number; search?: string }) => {
    const { data } = await quizAPI.getAll(params);
    return data;
  }
);

export const fetchQuizById = createAsyncThunk(
  'quizzes/fetchById',
  async (id: string) => {
    const { data } = await quizAPI.getById(id);
    return data.data;
  }
);

export const createQuiz = createAsyncThunk(
  'quizzes/create',
  async (quizData: Partial<IQuiz>) => {
    const { data } = await quizAPI.create(quizData);
    return data.data;
  }
);

export const updateQuiz = createAsyncThunk(
  'quizzes/update',
  async ({ id, data }: { id: string; data: Partial<IQuiz> }) => {
    const { data: response } = await quizAPI.update(id, data);
    return response.data;
  }
);

export const deleteQuiz = createAsyncThunk(
  'quizzes/delete',
  async (id: string) => {
    await quizAPI.delete(id);
    return id;
  }
);

const quizSlice = createSlice({
  name: 'quizzes',
  initialState,
  reducers: {
    setCurrentQuiz: (state, action: PayloadAction<IQuiz | null>) => {
      state.currentQuiz = action.payload;
    },
    clearError: (state) => {
      state.error = null;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchQuizzes.pending, (state) => {
        state.loading = true;
      })
      .addCase(fetchQuizzes.fulfilled, (state, action) => {
        state.loading = false;
        state.quizzes = action.payload.data;
        state.total = action.payload.total;
        state.pages = action.payload.pages;
        state.page = action.payload.page;
      })
      .addCase(fetchQuizzes.rejected, (state) => {
        state.loading = false;
        state.error = 'Failed to fetch quizzes';
      })
      .addCase(fetchQuizById.fulfilled, (state, action) => {
        state.currentQuiz = action.payload;
      })
      .addCase(createQuiz.fulfilled, (state, action) => {
        state.quizzes.unshift(action.payload);
        state.total += 1;
      })
      .addCase(updateQuiz.fulfilled, (state, action) => {
        const index = state.quizzes.findIndex((q) => q._id === action.payload._id);
        if (index !== -1) {
          state.quizzes[index] = action.payload;
        }
      })
      .addCase(deleteQuiz.fulfilled, (state, action) => {
        state.quizzes = state.quizzes.filter((q) => q._id !== action.payload);
        state.total -= 1;
      });
  },
});

export const { setCurrentQuiz, clearError } = quizSlice.actions;
export default quizSlice.reducer;
