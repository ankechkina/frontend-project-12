import { configureStore } from '@reduxjs/toolkit';
import { authApi } from '../api/authApi';
import authReducer from './authSlice';

export default configureStore({
  reducer: {
    [authApi.reducerPath]: authApi.reducer,
    auth: authReducer,
  },
  middleware: (getDefaultMiddleware) => getDefaultMiddleware().concat(authApi.middleware),
});
