import { createSlice } from '@reduxjs/toolkit';
import { removeChannel } from './channelsSlice';

const initialState = {
  messages: [],
};

const messagesSlice = createSlice({
  name: 'messages',
  initialState,
  reducers: {
    addNewMessage: (state, action) => ({
      ...state,
      messages: [...state.messages, action.payload],
    }),
  },
  extraReducers: (builder) => {
    builder.addCase(removeChannel, (state, action) => {
      const { id } = action.payload;
      return {
        ...state,
        messages: state.messages.filter((message) => message.channelId !== id),
      };
    });
  },
});

export const { addNewMessage } = messagesSlice.actions;

export default messagesSlice.reducer;
