import { createSlice, createAsyncThunk, type PayloadAction } from '@reduxjs/toolkit';
import type { IMessage, IAnnouncement } from '../../api/types';
import API from '../../api/axios';

interface ChatState {
  messages: IMessage[];
  conversations: { userId: string; lastMessage: IMessage | null; unreadCount: number }[];
  announcements: IAnnouncement[];
  loading: boolean;
  error: string | null;
}

const initialState: ChatState = {
  messages: [],
  conversations: [],
  announcements: [],
  loading: false,
  error: null,
};

export const fetchMessages = createAsyncThunk(
  'chat/fetchMessages',
  async ({ userId, courseId }: { userId?: string; courseId?: string }) => {
    const { data } = await API.get('/chat/messages', { params: { userId, courseId } });
    return data.data;
  }
);

export const sendMessage = createAsyncThunk(
  'chat/sendMessage',
  async (messageData: { receiverId: string; content: string; courseId?: string }) => {
    const { data } = await API.post('/chat/send', messageData);
    return data.data;
  }
);

export const fetchConversations = createAsyncThunk(
  'chat/fetchConversations',
  async () => {
    const { data } = await API.get('/chat/conversations');
    return data.data;
  }
);

export const fetchAnnouncements = createAsyncThunk(
  'chat/fetchAnnouncements',
  async (params?: { courseId?: string; tenantId?: string }) => {
    const { data } = await API.get('/chat/announcements', { params });
    return data.data;
  }
);

export const createAnnouncement = createAsyncThunk(
  'chat/createAnnouncement',
  async (announcementData: Partial<IAnnouncement>) => {
    const { data } = await API.post('/chat/announcements', announcementData);
    return data.data;
  }
);

const chatSlice = createSlice({
  name: 'chat',
  initialState,
  reducers: {
    clearMessages: (state) => {
      state.messages = [];
    },
    clearError: (state) => {
      state.error = null;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchMessages.pending, (state) => {
        state.loading = true;
      })
      .addCase(fetchMessages.fulfilled, (state, action) => {
        state.loading = false;
        state.messages = action.payload;
      })
      .addCase(fetchMessages.rejected, (state) => {
        state.loading = false;
        state.error = 'Failed to fetch messages';
      })
      .addCase(sendMessage.fulfilled, (state, action) => {
        state.messages.push(action.payload);
      })
      .addCase(fetchConversations.fulfilled, (state, action) => {
        state.conversations = action.payload;
      })
      .addCase(fetchAnnouncements.fulfilled, (state, action) => {
        state.announcements = action.payload;
      })
      .addCase(createAnnouncement.fulfilled, (state, action) => {
        state.announcements.unshift(action.payload);
      });
  },
});

export const { clearMessages, clearError } = chatSlice.actions;
export default chatSlice.reducer;
