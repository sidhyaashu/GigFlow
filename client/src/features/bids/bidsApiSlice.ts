import { apiSlice } from '../api/apiSlice';

export const bidsApiSlice = apiSlice.injectEndpoints({
    endpoints: (builder: any) => ({
        submitBid: builder.mutation({
            query: (data: any) => ({
                url: 'https://gigflow-backend-bj4g.onrender.com/api/bids',
                method: 'POST',
                body: data,
            }),
            invalidatesTags: ['Bid'],
        }),
        getGigBids: builder.query({
            query: (gigId: string) => `https://gigflow-backend-bj4g.onrender.com/api/bids/${gigId}`,
            providesTags: ['Bid'],
        }),
        hireFreelancer: builder.mutation({
            query: ({ bidId }: { bidId: string }) => ({
                url: `https://gigflow-backend-bj4g.onrender.com/api/bids/${bidId}/hire`,
                method: 'PATCH',
            }),
            invalidatesTags: ['Bid', 'Gig'], // Invalidate Gig to update status to assigned
        }),
    }),
});

export const { useSubmitBidMutation, useGetGigBidsQuery, useHireFreelancerMutation } = bidsApiSlice;
