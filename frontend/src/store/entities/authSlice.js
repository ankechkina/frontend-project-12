import { createSlice } from '@reduxjs/toolkit';

const initialState = {
  token: localStorage.getItem('token') || null,
  username: null,
};

const authSlice = createSlice({
  name: 'user',
  initialState,
  reducers: {
    setUserData: (state, action) => {
      const { token, username } = action.payload;
      return {
        ...state,
        token: token || state.token,
        username: username || state.username,
      };
    },
    logOut: (state) => {
      localStorage.removeItem('token');
      return {
        ...state,
        token: null,
        username: null,
      };
    },
  },
});

export const { setUserData, logOut } = authSlice.actions;

export default authSlice.reducer;
