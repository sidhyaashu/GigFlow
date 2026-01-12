import { apiSlice } from '../api/apiSlice';

export const usersApiSlice = apiSlice.injectEndpoints({
    endpoints: (builder: any) => ({
        login: builder.mutation({
            query: (data: any) => ({
                url: '/auth/login',
                method: 'POST',
                body: data,
            }),
        }),
        register: builder.mutation({
            query: (data: any) => ({
                url: '/auth/register',
                method: 'POST',
                body: data,
            }),
        }),
        logout: builder.mutation({
            query: () => ({
                url: '/auth/logout',
                method: 'POST',
            }),
        }),
    }),
});

export const { useLoginMutation, useRegisterMutation, useLogoutMutation } = usersApiSlice;
