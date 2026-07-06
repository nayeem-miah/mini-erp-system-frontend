"use client";

import { baseApi } from "./baseApi";

export const dashboardApi = baseApi.injectEndpoints({
  endpoints: (builder) => ({
    getInsights: builder.query({
      query: () => "/dashboard/insights",
      providesTags: ["Product", "Sale"],
    }),
  }),
});

export const { useGetInsightsQuery } = dashboardApi;
