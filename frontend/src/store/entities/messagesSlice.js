import { createSlice } from '@reduxjs/toolkit';
import { removeChannel } from './channelsSlice';

const initialState = {
  messages: [],
  error: null,
};

const messagesSlice = createSlice({
  name: 'messages',
  initialState,
  reducers: {
    setMessages: (state, action) => {
      state.messages = action.payload;
    },
    setMessagesError: (state, action) => {
      state.error = action.payload;
    },
    addNewMessage: (state, action) => {
      state.messages.push(action.payload);
    },
  },
  extraReducers: (builder) => {
    builder.addCase(removeChannel, (state, action) => {
      const { id } = action.payload;
      const restMessages = state.messages.filter((message) => message.channelId !== id);
      state.messages = restMessages;
    });
  },
});

export const { setMessages, setMessagesError, addNewMessage } = messagesSlice.actions;

export default messagesSlice.reducer;
