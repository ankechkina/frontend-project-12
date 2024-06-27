import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import { fetchChannels } from '../../api/api';

const initialState = {
  channels: [],
  currentChannelId: '1',
  loading: false,
  error: null,
};

export const loadChannels = createAsyncThunk(
  'auth/loadChannels',
  async (_, { getState }) => {
    const { token } = getState().authorization;
    try {
      const channelsData = await fetchChannels(token);
      return channelsData;
    } catch (error) {
      console.error('Ошибка при загрузке каналов:', error);
      throw error;
    }
  },
);

const channelsSlice = createSlice({
  name: 'channels',
  initialState,
  reducers: {
    setCurrentChannel: (state, action) => {
      state.currentChannelId = action.payload;
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
  },
});

export const { setCurrentChannel } = channelsSlice.actions;

export default channelsSlice.reducer;
