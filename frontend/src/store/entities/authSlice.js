import { createSlice } from '@reduxjs/toolkit';

const initialState = {
  token: localStorage.getItem('token') || null,
  isAuthenticated: !!localStorage.getItem('token'),
  username: null,
  loading: false,
  error: null,
};

const authSlice = createSlice({
  name: 'authorization',
  initialState,
  reducers: {
    setUserData: (state, action) => {
      if (action.payload.token) {
        state.token = action.payload.token;
        state.isAuthenticated = true;
      }
      if (action.payload.username) {
        state.username = action.payload.username;
      }
    },
    logOut: (state) => {
      state.token = null;
      state.isAuthenticated = false;
      state.username = null;
      localStorage.removeItem('token');
    },
  },
});

export const { setUserData, logOut } = authSlice.actions;

export default authSlice.reducer;
