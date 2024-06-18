import { createSlice } from '@reduxjs/toolkit';

const initialState = {
  token: localStorage.getItem('token') || null,
  isAuthenticated: !!localStorage.getItem('token'),
};

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
    },
  },
});

export const { setUserData, logOut } = authSlice.actions;

export default authSlice.reducer;
