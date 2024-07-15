import { createApi, fetchBaseQuery } from '@reduxjs/toolkit/query/react';
import { API_ROUTES } from '../utils/router';
import prepareHeaders from '../utils/prepareHeaders';

export const messagesApi = createApi({
  reducerPath: 'messagesApi',
  baseQuery: fetchBaseQuery({
    baseUrl: API_ROUTES.base,
    prepareHeaders,
  }),
  tagTypes: ['Message'],
  endpoints: (builder) => ({
    getMessages: builder.query({
      query: () => '/messages',
      providesTags: (result) => {
        if (result) {
          return [
            ...result.map(({ id }) => ({ type: 'Message', id })),
            { type: 'Message', id: 'LIST' },
          ];
        }
        return [{ type: 'Message', id: 'LIST' }];
      },
    }),
    addMessage: builder.mutation({
      query: (message) => ({
        url: '/messages',
        method: 'POST',
        body: message,
      }),
      invalidatesTags: [{ type: 'Message', id: 'LIST' }],
    }),
  }),
});

export const { useGetMessagesQuery, useAddMessageMutation } = messagesApi;
