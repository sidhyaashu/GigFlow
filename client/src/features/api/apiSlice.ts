import { createApi, fetchBaseQuery } from '@reduxjs/toolkit/query/react';

export const apiSlice = createApi({
    reducerPath: 'api',
    baseQuery: fetchBaseQuery({
        baseUrl: 'https://gigflow-backend-bj4g.onrender.com/api', // Proxy in vite.config.ts will handle this
        prepareHeaders: (headers) => {
            // Headers if needed
            return headers;
        },
    }),
    tagTypes: ['Gig', 'Bid', 'User'],
    endpoints: () => ({}),
});
