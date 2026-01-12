import { apiSlice } from '../api/apiSlice';

export const gigsApiSlice = apiSlice.injectEndpoints({
    endpoints: (builder: any) => ({
        getGigs: builder.query({
            query: (keyword: string) => ({
                url: 'https://gigflow-backend-bj4g.onrender.com/api/gigs',
                params: { search: keyword },
            }),
            providesTags: ['Gig'],
        }),
        createGig: builder.mutation({
            query: (data: any) => ({
                url: 'https://gigflow-backend-bj4g.onrender.com/api/gigs',
                method: 'POST',
                body: data,
            }),
            invalidatesTags: ['Gig'],
        }),
        getMyGigs: builder.query({
            query: () => 'https://gigflow-backend-bj4g.onrender.com/api/gigs/my-gigs',
            providesTags: ['Gig'],
        }),
        getGigById: builder.query({
            query: (id: string) => `https://gigflow-backend-bj4g.onrender.com/api/gigs/${id}`,
            providesTags: ['Gig'],
        }),
    }),
});

export const { useGetGigsQuery, useCreateGigMutation, useGetMyGigsQuery, useGetGigByIdQuery } = gigsApiSlice;
