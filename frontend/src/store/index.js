import { configureStore } from '@reduxjs/toolkit';
import { authApi } from '../api/authApi';
import authReducer from './entities/authSlice';
import channelsReducer from './entities/channelsSlice';
import { channelsApi } from '../api/channelsApi';
import { messagesApi } from '../api/messagesApi';
import modalReducer from './entities/modalSlice';

export default configureStore({
  reducer: {
    [authApi.reducerPath]: authApi.reducer,
    [channelsApi.reducerPath]: channelsApi.reducer,
    [messagesApi.reducerPath]: messagesApi.reducer,
    user: authReducer,
    channels: channelsReducer,
    modalWindow: modalReducer,
  },
  middleware: (getDefaultMiddleware) => getDefaultMiddleware().concat(
    authApi.middleware,
    channelsApi.middleware,
    messagesApi.middleware,
  ),
});
