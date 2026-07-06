"use client";

import React from "react";
import { useAuth } from "@/context/AuthContext";

export default function Home() {
  const { user } = useAuth();

  if (!user) return null;

  return (
    <div className="flex flex-col gap-8">
      {/* Welcome Section */}
      <section className="flex flex-col gap-2 rounded-2xl bg-gradient-to-br from-primary/10 via-primary/5 to-background p-8 shadow-sm border border-primary/10">
        <h2 className="text-3xl font-bold tracking-tight">Dashboard</h2>
        <p className="text-lg text-muted-foreground">
          Welcome back, <span className="font-semibold text-foreground">{user.name}</span>! Overview of your Mini ERP system.
        </p>
      </section>

      {/* Overview Grid */}
      <section className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
        {/* Placeholder Stat Card 1 */}
        <div className="flex flex-col justify-between rounded-xl border bg-card p-6 shadow-sm transition-all hover:shadow-md hover:border-primary/20">
          <div className="flex items-center justify-between space-y-0 pb-2">
            <h3 className="text-sm font-medium tracking-tight text-muted-foreground">Total Products</h3>
            <div className="flex h-10 w-10 items-center justify-center rounded-full bg-primary/10 text-primary">
              <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M4 15s1-1 4-1 5 2 8 2 4-1 4-1V3s-1 1-4 1-5-2-8-2-4 1-4 1z"/><line x1="4" x2="4" y1="22" y2="15"/></svg>
            </div>
          </div>
          <div className="flex flex-col gap-1 mt-4">
            <div className="text-3xl font-bold">---</div>
            <p className="text-xs text-muted-foreground">Updated just now</p>
          </div>
        </div>

        {/* Placeholder Stat Card 2 */}
        <div className="flex flex-col justify-between rounded-xl border bg-card p-6 shadow-sm transition-all hover:shadow-md hover:border-primary/20">
          <div className="flex items-center justify-between space-y-0 pb-2">
            <h3 className="text-sm font-medium tracking-tight text-muted-foreground">Total Sales</h3>
            <div className="flex h-10 w-10 items-center justify-center rounded-full bg-primary/10 text-primary">
              <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M12 20h9"/><path d="M16.5 3.5a2.12 2.12 0 0 1 3 3L7 19l-4 1 1-4Z"/></svg>
            </div>
          </div>
          <div className="flex flex-col gap-1 mt-4">
            <div className="text-3xl font-bold">---</div>
            <p className="text-xs text-muted-foreground">Updated just now</p>
          </div>
        </div>

        {/* Placeholder Stat Card 3 */}
        <div className="flex flex-col justify-between rounded-xl border bg-card p-6 shadow-sm transition-all hover:shadow-md hover:border-destructive/30">
          <div className="flex items-center justify-between space-y-0 pb-2">
            <h3 className="text-sm font-medium tracking-tight text-muted-foreground">Low Stock</h3>
            <div className="flex h-10 w-10 items-center justify-center rounded-full bg-destructive/10 text-destructive">
              <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M10.29 3.86L1.82 18a2 2 0 0 0 1.71 3h16.94a2 2 0 0 0 1.71-3L13.71 3.86a2 2 0 0 0-3.42 0z"/><line x1="12" y1="9" x2="12" y2="13"/><line x1="12" y1="17" x2="12.01" y2="17"/></svg>
            </div>
          </div>
          <div className="flex flex-col gap-1 mt-4">
            <div className="text-3xl font-bold text-destructive">---</div>
            <p className="text-xs text-muted-foreground">Requires attention</p>
          </div>
        </div>
        
        {/* Larger Chart Area Placeholder */}
        <div className="col-span-1 md:col-span-2 lg:col-span-3 mt-2 flex flex-col rounded-xl border bg-card shadow-sm transition-all hover:shadow-md">
          <div className="border-b border-border/50 p-6">
            <h3 className="text-lg font-semibold tracking-tight">Recent Activity Overview</h3>
            <p className="text-sm text-muted-foreground">ERP Statistics will be displayed here.</p>
          </div>
          <div className="flex min-h-[300px] flex-col items-center justify-center p-8 text-muted-foreground bg-muted/10 rounded-b-xl">
             <svg xmlns="http://www.w3.org/2000/svg" width="48" height="48" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1" strokeLinecap="round" strokeLinejoin="round" className="mb-4 opacity-30"><line x1="18" y1="20" x2="18" y2="10"/><line x1="12" y1="20" x2="12" y2="4"/><line x1="6" y1="20" x2="6" y2="14"/></svg>
             <p className="font-medium">Chart data placeholder</p>
             <p className="text-sm mt-1 opacity-70">Analytics data will populate here when available</p>
          </div>
        </div>
      </section>
    </div>
  );
}
