import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import { fetchChannels, fetchMessages } from '../api/api';

const initialState = {
  token: localStorage.getItem('token') || null,
  isAuthenticated: !!localStorage.getItem('token'),
  channels: [],
  messages: [],
  loading: false,
  error: null,
};

export const loadChannels = createAsyncThunk(
  'auth/loadChannels',
  async (_, { getState }) => {
    const { token } = getState().auth;
    try {
      const channelsData = await fetchChannels(token);
      return channelsData;
    } catch (error) {
      console.error('Ошибка при загрузке каналов:', error);
      throw error;
    }
  },
);

export const loadMessages = createAsyncThunk(
  'auth/loadMessages',
  async (_, { getState }) => {
    const { token } = getState().auth;
    try {
      const messagesData = await fetchMessages(token);
      return messagesData;
    } catch (error) {
      console.error('Ошибка при загрузке сообщений:', error);
      throw error;
    }
  },
);

const authSlice = createSlice({
  name: 'auth',
  initialState,
  reducers: {
    setUserData: (state, action) => {
      state.token = action.payload.token;
      state.isAuthenticated = true;
    },
    logOut: (state) => {
      state.token = null;
      state.isAuthenticated = false;
      localStorage.removeItem('token');
    },
  },
  extraReducers: {
    [loadChannels.pending]: (state) => {
      state.loading = true;
      state.error = null;
    },
    [loadChannels.fulfilled]: (state, action) => {
      state.loading = false;
      state.channels = action.payload;
    },
    [loadChannels.rejected]: (state, action) => {
      state.loading = false;
      state.error = action.error.message;
    },
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

export const { setUserData, logOut } = authSlice.actions;

export default authSlice.reducer;
