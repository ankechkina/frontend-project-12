import { createSlice } from '@reduxjs/toolkit';

const initialState = {
  token: null,
  username: null,
};

const userSlice = createSlice({
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
    logOut: (state) => ({
      ...state,
      token: null,
      username: null,
    })
    ,
  },
});

export const { setUserData, logOut } = userSlice.actions;

export const selectIsAuthenticated = (state) => !!state.user.token;

export default userSlice.reducer;
