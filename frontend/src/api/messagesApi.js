import { createApi, fetchBaseQuery } from '@reduxjs/toolkit/query/react';
import { API_ROUTES } from '../utils/router';

export const messagesApi = createApi({
  reducerPath: 'messagesApi',
  baseQuery: fetchBaseQuery({
    baseUrl: API_ROUTES.base,
    prepareHeaders: (headers, { getState }) => {
      const { token } = getState().authorization;
      if (token) {
			  headers.set('Authorization', `Bearer ${token}`);
      }
      return headers;
		 },
	  }),
  endpoints: (builder) => ({
    getMessages: builder.query({
      query: () => '/messages',
		 }),
  }),
});

export const { useGetMessagesQuery } = messagesApi;
