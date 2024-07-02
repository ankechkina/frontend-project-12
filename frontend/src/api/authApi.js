import { createApi, fetchBaseQuery } from '@reduxjs/toolkit/query/react';
import { API_ROUTES } from '../utils/router';

export const authApi = createApi({
  reducerPath: 'authApi',
  baseQuery: fetchBaseQuery({ baseUrl: API_ROUTES.base }),
  endpoints: (builder) => ({
    login: builder.mutation({
      query: (userData) => ({
        url: API_ROUTES.login,
        method: 'POST',
        body: userData,
      }),
    }),
    createNewUser: builder.mutation({
      query: (newUserData) => ({
        url: API_ROUTES.signup,
        method: 'POST',
        body: newUserData,
      }),
    }),
  }),
});

export const { useLoginMutation, useCreateNewUserMutation } = authApi;
