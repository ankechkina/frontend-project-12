import { configureStore } from '@reduxjs/toolkit';
import { authApi } from '../api/authApi';
import authReducer from './entities/authSlice';

export default configureStore({
  reducer: {
    [authApi.reducerPath]: authApi.reducer,
    authorization: authReducer,
  },
  middleware: (getDefaultMiddleware) => getDefaultMiddleware().concat(authApi.middleware),
});
