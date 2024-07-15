import { createSlice } from '@reduxjs/toolkit';

export const defaultChannelId = '1';

const initialState = {
  channels: [],
  currentChannelId: defaultChannelId,
};

const channelsSlice = createSlice({
  name: 'channels',
  initialState,
  reducers: {
    setCurrentChannel: (state, action) => ({
      ...state,
      currentChannelId: action.payload,
    }),
    setFetchedChannels: (state, action) => ({
      ...state,
      channels: action.payload,
    }),
    addNewChannel: (state, action) => ({
      ...state,
      channels: [...state.channels, action.payload],
    }),
    changeChannelName: (state, action) => {
      const { id, name } = action.payload;
      const updatedChannels = state.channels.map((channel) => (
        channel.id === id
          ? { ...channel, name }
          : channel
      ));
      return {
        ...state,
        channels: updatedChannels,
      };
    },
    removeChannel: (state, action) => {
      const { id } = action.payload;
      return {
        ...state,
        channels: state.channels.filter((channel) => channel.id !== id),
      };
    },
  },
});

export const {
  setCurrentChannel, addNewChannel, changeChannelName, removeChannel, setFetchedChannels,
} = channelsSlice.actions;

export default channelsSlice.reducer;
