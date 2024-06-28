import { createSlice } from '@reduxjs/toolkit';

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
});

export const { setMessages, setMessagesError, addNewMessage } = messagesSlice.actions;

export default messagesSlice.reducer;
