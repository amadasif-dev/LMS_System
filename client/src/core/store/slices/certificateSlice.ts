import { createSlice, createAsyncThunk, type PayloadAction } from '@reduxjs/toolkit';
import type { ICertificate } from '../../api/types';
import API from '../../api/axios';

interface CertificateState {
  certificates: ICertificate[];
  loading: boolean;
  error: string | null;
}

const initialState: CertificateState = {
  certificates: [],
  loading: false,
  error: null,
};

export const fetchCertificates = createAsyncThunk(
  'certificates/fetchAll',
  async (params?: { studentId?: string; courseId?: string }) => {
    const { data } = await API.get('/certificates', { params });
    return data.data;
  }
);

export const generateCertificate = createAsyncThunk(
  'certificates/generate',
  async ({ courseId, studentId }: { courseId: string; studentId: string }) => {
    const { data } = await API.post('/certificates/generate', { courseId, studentId });
    return data.data;
  }
);

export const verifyCertificate = createAsyncThunk(
  'certificates/verify',
  async (certificateNumber: string) => {
    const { data } = await API.get(`/certificates/verify/${certificateNumber}`);
    return data.data;
  }
);

const certificateSlice = createSlice({
  name: 'certificates',
  initialState,
  reducers: {
    clearError: (state) => {
      state.error = null;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchCertificates.pending, (state) => {
        state.loading = true;
      })
      .addCase(fetchCertificates.fulfilled, (state, action) => {
        state.loading = false;
        state.certificates = action.payload;
      })
      .addCase(fetchCertificates.rejected, (state) => {
        state.loading = false;
        state.error = 'Failed to fetch certificates';
      })
      .addCase(generateCertificate.fulfilled, (state, action) => {
        state.certificates.unshift(action.payload);
      });
  },
});

export const { clearError } = certificateSlice.actions;
export default certificateSlice.reducer;
