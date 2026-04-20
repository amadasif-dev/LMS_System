import { createSlice, createAsyncThunk, type PayloadAction } from '@reduxjs/toolkit';
import type { ITimetableEntry } from '../../api/types';
import API from '../../api/axios';

interface TimetableState {
  entries: ITimetableEntry[];
  loading: boolean;
  error: string | null;
}

const initialState: TimetableState = {
  entries: [],
  loading: false,
  error: null,
};

export const fetchTimetable = createAsyncThunk(
  'timetable/fetchAll',
  async (params?: { courseId?: string; teacherId?: string }) => {
    const { data } = await API.get('/timetable', { params });
    return data.data;
  }
);

export const createTimetableEntry = createAsyncThunk(
  'timetable/create',
  async (entryData: Partial<ITimetableEntry>) => {
    const { data } = await API.post('/timetable', entryData);
    return data.data;
  }
);

export const updateTimetableEntry = createAsyncThunk(
  'timetable/update',
  async ({ id, data }: { id: string; data: Partial<ITimetableEntry> }) => {
    const { data: response } = await API.put(`/timetable/${id}`, data);
    return response.data;
  }
);

export const deleteTimetableEntry = createAsyncThunk(
  'timetable/delete',
  async (id: string) => {
    await API.delete(`/timetable/${id}`);
    return id;
  }
);

const timetableSlice = createSlice({
  name: 'timetable',
  initialState,
  reducers: {
    clearError: (state) => {
      state.error = null;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchTimetable.pending, (state) => {
        state.loading = true;
      })
      .addCase(fetchTimetable.fulfilled, (state, action) => {
        state.loading = false;
        state.entries = action.payload;
      })
      .addCase(fetchTimetable.rejected, (state) => {
        state.loading = false;
        state.error = 'Failed to fetch timetable';
      })
      .addCase(createTimetableEntry.fulfilled, (state, action) => {
        state.entries.push(action.payload);
      })
      .addCase(updateTimetableEntry.fulfilled, (state, action) => {
        const index = state.entries.findIndex((e) => e._id === action.payload._id);
        if (index !== -1) {
          state.entries[index] = action.payload;
        }
      })
      .addCase(deleteTimetableEntry.fulfilled, (state, action) => {
        state.entries = state.entries.filter((e) => e._id !== action.payload);
      });
  },
});

export const { clearError } = timetableSlice.actions;
export default timetableSlice.reducer;
