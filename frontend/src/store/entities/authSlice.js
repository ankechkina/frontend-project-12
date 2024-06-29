import { createSlice } from '@reduxjs/toolkit';

const initialState = {
  token: localStorage.getItem('token') || null,
  username: null,
  loading: false,
  error: null,
};

const authSlice = createSlice({
  name: 'user',
  initialState,
  reducers: {
    setUserData: (state, action) => {
      if (action.payload.token) {
        state.token = action.payload.token;
      }
      if (action.payload.username) {
        state.username = action.payload.username;
      }
    },
    logOut: (state) => {
      state.token = null;
      state.username = null;
      localStorage.removeItem('token');
    },
  },
});

export const { setUserData, logOut } = authSlice.actions;

export default authSlice.reducer;
