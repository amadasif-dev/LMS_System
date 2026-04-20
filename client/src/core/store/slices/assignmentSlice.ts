import { createSlice, createAsyncThunk, type PayloadAction } from '@reduxjs/toolkit';
import type { IAssignment, ISubmission } from '../../api/types';
import { assignmentAPI } from '../../api/endpoints/assignments';

interface AssignmentState {
  assignments: IAssignment[];
  currentAssignment: IAssignment | null;
  submissions: ISubmission[];
  total: number;
  pages: number;
  page: number;
  loading: boolean;
  error: string | null;
}

const initialState: AssignmentState = {
  assignments: [],
  currentAssignment: null,
  submissions: [],
  total: 0,
  pages: 0,
  page: 1,
  loading: false,
  error: null,
};

export const fetchAssignments = createAsyncThunk(
  'assignments/fetchAll',
  async (params?: { page?: number; limit?: number; search?: string }) => {
    const { data } = await assignmentAPI.getAll(params);
    return data;
  }
);

export const fetchAssignmentById = createAsyncThunk(
  'assignments/fetchById',
  async (id: string) => {
    const { data } = await assignmentAPI.getById(id);
    return data.data;
  }
);

export const createAssignment = createAsyncThunk(
  'assignments/create',
  async (assignmentData: Partial<IAssignment>) => {
    const { data } = await assignmentAPI.create(assignmentData);
    return data.data;
  }
);

export const updateAssignment = createAsyncThunk(
  'assignments/update',
  async ({ id, data }: { id: string; data: Partial<IAssignment> }) => {
    const { data: response } = await assignmentAPI.update(id, data);
    return response.data;
  }
);

export const deleteAssignment = createAsyncThunk(
  'assignments/delete',
  async (id: string) => {
    await assignmentAPI.delete(id);
    return id;
  }
);

export const fetchSubmissions = createAsyncThunk(
  'assignments/fetchSubmissions',
  async (assignmentId: string) => {
    const { data } = await assignmentAPI.getSubmissions(assignmentId);
    return data.data;
  }
);

const assignmentSlice = createSlice({
  name: 'assignments',
  initialState,
  reducers: {
    setCurrentAssignment: (state, action: PayloadAction<IAssignment | null>) => {
      state.currentAssignment = action.payload;
    },
    clearError: (state) => {
      state.error = null;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchAssignments.pending, (state) => {
        state.loading = true;
      })
      .addCase(fetchAssignments.fulfilled, (state, action) => {
        state.loading = false;
        state.assignments = action.payload.data;
        state.total = action.payload.total;
        state.pages = action.payload.pages;
        state.page = action.payload.page;
      })
      .addCase(fetchAssignments.rejected, (state) => {
        state.loading = false;
        state.error = 'Failed to fetch assignments';
      })
      .addCase(fetchAssignmentById.fulfilled, (state, action) => {
        state.currentAssignment = action.payload;
      })
      .addCase(createAssignment.fulfilled, (state, action) => {
        state.assignments.unshift(action.payload);
        state.total += 1;
      })
      .addCase(updateAssignment.fulfilled, (state, action) => {
        const index = state.assignments.findIndex((a) => a._id === action.payload._id);
        if (index !== -1) {
          state.assignments[index] = action.payload;
        }
      })
      .addCase(deleteAssignment.fulfilled, (state, action) => {
        state.assignments = state.assignments.filter((a) => a._id !== action.payload);
        state.total -= 1;
      })
      .addCase(fetchSubmissions.fulfilled, (state, action) => {
        state.submissions = action.payload;
      });
  },
});

export const { setCurrentAssignment, clearError } = assignmentSlice.actions;
export default assignmentSlice.reducer;
