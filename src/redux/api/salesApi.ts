"use client";

import { baseApi } from "./baseApi";

export const salesApi = baseApi.injectEndpoints({
  endpoints: (builder) => ({
    getSales: builder.query({
      query: (params?: { page?: number; limit?: number; searchTerm?: string; dateFilter?: string }) => ({
        url: "/sales",
        method: "GET",
        params,
      }),
      providesTags: ["Sale"],
    }),
    getMySales: builder.query({
      query: (params?: { page?: number; limit?: number; searchTerm?: string; dateFilter?: string }) => ({
        url: "/sales/my-sales",
        method: "GET",
        params,
      }),
      providesTags: ["Sale"],
    }),
    getSale: builder.query({
      query: (id) => `/sales/${id}`,
      providesTags: ["Sale"],
    }),
    createSale: builder.mutation({
      query: (payload) => ({
        url: "/sales",
        method: "POST",
        body: payload,
      }),
      invalidatesTags: ["Sale", "Product"],
    }),
  }),
});

export const {
  useGetSalesQuery,
  useGetMySalesQuery,
  useGetSaleQuery,
  useCreateSaleMutation,
} = salesApi;
