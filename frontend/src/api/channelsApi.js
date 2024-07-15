import { createApi, fetchBaseQuery } from '@reduxjs/toolkit/query/react';
import { API_ROUTES } from '../utils/router';
import prepareHeaders from '../utils/prepareHeaders';

export const channelsApi = createApi({
  reducerPath: 'channelsApi',
  baseQuery: fetchBaseQuery({
    baseUrl: API_ROUTES.base,
    prepareHeaders,
  }),
  tagTypes: ['Channel'],
  endpoints: (builder) => ({
    getChannels: builder.query({
      query: () => '/channels',
      providesTags: (result) => (result
        ? [...result.map(({ id }) => ({ type: 'Channel', id })), { type: 'Channel', id: 'LIST' }]
        : [{ type: 'Channel', id: 'LIST' }]),
    }),
    addChannel: builder.mutation({
      query: (channelName) => ({
        url: '/channels',
        method: 'POST',
        body: channelName,
      }),
      invalidatesTags: [{ type: 'Channel', id: 'LIST' }],
    }),
    editChannel: builder.mutation({
      query: ({ id, newChannelName }) => ({
        url: `/channels/${id}`,
        method: 'PATCH',
        body: newChannelName,
      }),
      invalidatesTags: (result, error, { id }) => [{ type: 'Channel', id }],
    }),
    removeChannel: builder.mutation({
      query: (id) => ({
        url: `/channels/${id}`,
        method: 'DELETE',
      }),
      invalidatesTags: (result, error, id) => [{ type: 'Channel', id }],
    }),
  }),
});

export const {
  useGetChannelsQuery,
  useAddChannelMutation,
  useEditChannelMutation,
  useRemoveChannelMutation,
} = channelsApi;
