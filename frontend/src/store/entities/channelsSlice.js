import { createSlice } from '@reduxjs/toolkit';

export const defaultChannelId = '1';

const initialState = {
  channels: [],
  currentChannelId: defaultChannelId,
  error: null,
};

const channelsSlice = createSlice({
  name: 'channels',
  initialState,
  reducers: {
    setCurrentChannel: (state, action) => {
      state.currentChannelId = action.payload;
    },
    setFetchedChannels: (state, action) => {
      state.channels = action.payload;
    },
    setChannelsError: (state, action) => {
      state.error = action.payload;
    },
    addNewChannel: (state, action) => {
      state.channels.push(action.payload);
    },
    changeChannelName: (state, action) => {
      const { id, name } = action.payload;
      const foundChannel = state.channels.find((channel) => channel.id === id);
      foundChannel.name = name;
    },
  },
});

export const {
  setCurrentChannel, setFetchedChannels, setChannelsError, addNewChannel, changeChannelName,
} = channelsSlice.actions;

export default channelsSlice.reducer;
