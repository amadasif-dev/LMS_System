import { createSlice, type PayloadAction } from '@reduxjs/toolkit';

interface UIState {
  sidebarOpen: boolean;
  theme: 'light' | 'dark';
  isLoading: boolean;
  toasts: { id: string; message: string; type: 'success' | 'error' | 'warning' | 'info' }[];
}

const initialState: UIState = {
  sidebarOpen: true,
  theme: 'light',
  isLoading: false,
  toasts: [],
};

const uiSlice = createSlice({
  name: 'ui',
  initialState,
  reducers: {
    toggleSidebar: (state) => {
      state.sidebarOpen = !state.sidebarOpen;
    },
    setSidebarOpen: (state, action: PayloadAction<boolean>) => {
      state.sidebarOpen = action.payload;
    },
    setTheme: (state, action: PayloadAction<'light' | 'dark'>) => {
      state.theme = action.payload;
    },
    setLoading: (state, action: PayloadAction<boolean>) => {
      state.isLoading = action.payload;
    },
    addToast: (state, action: PayloadAction<{ message: string; type: 'success' | 'error' | 'warning' | 'info' }>) => {
      state.toasts.push({ ...action.payload, id: Date.now().toString() });
    },
    removeToast: (state, action: PayloadAction<string>) => {
      state.toasts = state.toasts.filter((t) => t.id !== action.payload);
    },
  },
});

export const { toggleSidebar, setSidebarOpen, setTheme, setLoading, addToast, removeToast } = uiSlice.actions;
export default uiSlice.reducer;
