import { apiSlice } from '../api/apiSlice';

export const gigsApiSlice = apiSlice.injectEndpoints({
    endpoints: (builder: any) => ({
        getGigs: builder.query({
            query: (keyword: string) => ({
                url: '/gigs',
                params: { search: keyword },
            }),
            providesTags: ['Gig'],
        }),
        createGig: builder.mutation({
            query: (data: any) => ({
                url: '/gigs',
                method: 'POST',
                body: data,
            }),
            invalidatesTags: ['Gig'],
        }),
        getMyGigs: builder.query({
            query: () => '/gigs/my-gigs',
            providesTags: ['Gig'],
        }),
        getGigById: builder.query({
            query: (id: string) => `/gigs/${id}`,
            providesTags: ['Gig'],
        }),
    }),
});

export const { useGetGigsQuery, useCreateGigMutation, useGetMyGigsQuery, useGetGigByIdQuery } = gigsApiSlice;
