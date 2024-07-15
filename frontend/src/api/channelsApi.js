import { createApi, fetchBaseQuery } from '@reduxjs/toolkit/query/react';
import { API_ROUTES } from '../utils/router';
import prepareHeaders from '../utils/prepareHeaders';

export const channelsApi = createApi({
  reducerPath: 'channelsApi',
  baseQuery: fetchBaseQuery({
    baseUrl: API_ROUTES.base,
    prepareHeaders,
  }),
  endpoints: (builder) => ({
    getChannels: builder.query({
      query: () => '/channels',
    }),
    addChannel: builder.mutation({
      query: (channelName) => ({
        url: '/channels',
        method: 'POST',
        body: channelName,
      }),
    }),
    editChannel: builder.mutation({
      query: ({ id, newChannelName }) => ({
        url: `/channels/${id}`,
        method: 'PATCH',
        body: newChannelName,
      }),
    }),
    removeChannel: builder.mutation({
      query: (id) => ({
        url: `/channels/${id}`,
        method: 'DELETE',
      }),
    }),
  }),
});

export const {
  useGetChannelsQuery,
  useAddChannelMutation,
  useEditChannelMutation,
  useRemoveChannelMutation,
} = channelsApi;
