import { configureStore } from '@reduxjs/toolkit';
import { authApi } from '../api/authApi';
import userReducer from './entities/userSlice';
import channelsReducer from './entities/channelsSlice';
import messagesReducer from './entities/messagesSlice';
import { channelsApi } from '../api/channelsApi';
import { messagesApi } from '../api/messagesApi';
import modalReducer from './entities/modalSlice';

export default configureStore({
  reducer: {
    [authApi.reducerPath]: authApi.reducer,
    [channelsApi.reducerPath]: channelsApi.reducer,
    [messagesApi.reducerPath]: messagesApi.reducer,
    user: userReducer,
    channels: channelsReducer,
    messages: messagesReducer,
    modalWindow: modalReducer,
  },
  middleware: (getDefaultMiddleware) => getDefaultMiddleware().concat(
    authApi.middleware,
    channelsApi.middleware,
    messagesApi.middleware,
  ),
});
