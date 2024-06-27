import { configureStore } from '@reduxjs/toolkit';
import { authApi } from '../api/authApi';
import authReducer from './entities/authSlice';
import channelsReducer from './entities/channelsSlice';
import messagesReducer from './entities/messagesSlice';

export default configureStore({
  reducer: {
    [authApi.reducerPath]: authApi.reducer,
    authorization: authReducer,
    channels: channelsReducer,
    messages: messagesReducer,
  },
  middleware: (getDefaultMiddleware) => getDefaultMiddleware().concat(authApi.middleware),
});
