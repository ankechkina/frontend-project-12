import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import { fetchMessages } from '../../api/api';

const initialState = {
  messages: [],
  loading: false,
  error: null,
};

export const loadMessages = createAsyncThunk(
  'auth/loadMessages',
  async (_, { getState }) => {
    const { token } = getState().authorization;
    try {
      const messagesData = await fetchMessages(token);
      return messagesData;
    } catch (error) {
      console.error('Ошибка при загрузке сообщений:', error);
      throw error;
    }
  },
);

const messagesSlice = createSlice({
  name: 'messages',
  initialState,
  reducers: {
    setMessages: (state, action) => {
      state.messages.push(action.payload);
    },
  },
  extraReducers: {
    [loadMessages.pending]: (state) => {
      state.loading = true;
      state.error = null;
    },
    [loadMessages.fulfilled]: (state, action) => {
      state.loading = false;
      state.messages = action.payload;
    },
    [loadMessages.rejected]: (state, action) => {
      state.loading = false;
      state.error = action.error.message;
    },
  },
});

export const { setMessages } = messagesSlice.actions;

export default messagesSlice.reducer;
