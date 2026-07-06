/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";

import Loader from "@/components/ui/Loader";
import { useAuth } from "@/context/AuthContext";
import { useGetInsightsQuery } from "@/redux/api/dashboardApi";

export default function Home() {
  const { user } = useAuth();

  const { data: insightsResponse, isLoading, isError } = useGetInsightsQuery(undefined, {
    skip: !user,
  });

  if (!user) return null;
  if (isLoading) return <Loader minHeight="min-h-[400px]" />;

  const insights = insightsResponse?.data || {
    totalProducts: 0,
    totalSalesCount: 0,
    totalSalesRevenue: 0,
    lowStockProducts: [],
    lowStockProductsCount: 0,
  };

  return (
    <div className="flex flex-col gap-8">
      {/* Welcome Section */}
      <section className="flex flex-col gap-2 rounded-2xl bg-gradient-to-br from-primary/10 via-primary/5 to-background p-8 shadow-sm border border-primary/10">
        <h2 className="text-3xl font-bold tracking-tight">Dashboard</h2>
        <p className="text-lg text-muted-foreground">
          Welcome back, <span className="font-semibold text-foreground">{user.name}</span>! Overview of your Mini ERP system.
        </p>
      </section>

      {isError && (
        <div className="rounded-xl border border-destructive/20 bg-destructive/5 p-4 text-sm text-destructive flex items-center gap-2">
          <svg className="h-5 w-5 shrink-0" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2">
            <path strokeLinecap="round" strokeLinejoin="round" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
          </svg>
          <span>Failed to load real-time insights from backend. Showing default values.</span>
        </div>
      )}

      {/* Overview Grid */}
      <section className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
        {/* Total Products Card */}
        <div className="flex flex-col justify-between rounded-xl border bg-card p-6 shadow-sm transition-all hover:shadow-md hover:border-primary/20">
          <div className="flex items-center justify-between space-y-0 pb-2">
            <h3 className="text-sm font-medium tracking-tight text-muted-foreground">Total Products</h3>
            <div className="flex h-10 w-10 items-center justify-center rounded-full bg-primary/10 text-primary">
              <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M4 15s1-1 4-1 5 2 8 2 4-1 4-1V3s-1 1-4 1-5-2-8-2-4 1-4 1z"/><line x1="4" x2="4" y1="22" y2="15"/></svg>
            </div>
          </div>
          <div className="flex flex-col gap-1 mt-4">
            <div className="text-3xl font-bold">{insights.totalProducts}</div>
            <p className="text-xs text-muted-foreground">Items in product catalog</p>
          </div>
        </div>

        {/* Total Sales Card */}
        <div className="flex flex-col justify-between rounded-xl border bg-card p-6 shadow-sm transition-all hover:shadow-md hover:border-primary/20">
          <div className="flex items-center justify-between space-y-0 pb-2">
            <h3 className="text-sm font-medium tracking-tight text-muted-foreground">Total Sales Revenue</h3>
            <div className="flex h-10 w-10 items-center justify-center rounded-full bg-primary/10 text-primary">
              <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M12 20h9"/><path d="M16.5 3.5a2.12 2.12 0 0 1 3 3L7 19l-4 1 1-4Z"/></svg>
            </div>
          </div>
          <div className="flex flex-col gap-1 mt-4">
            <div className="text-3xl font-bold">${insights.totalSalesRevenue.toLocaleString()}</div>
            <p className="text-xs text-muted-foreground">{insights.totalSalesCount} transactions processed</p>
          </div>
        </div>

        {/* Low Stock Card */}
        <div className="flex flex-col justify-between rounded-xl border bg-card p-6 shadow-sm transition-all hover:shadow-md hover:border-destructive/30">
          <div className="flex items-center justify-between space-y-0 pb-2">
            <h3 className="text-sm font-medium tracking-tight text-muted-foreground">Low Stock alerts</h3>
            <div className={`flex h-10 w-10 items-center justify-center rounded-full ${
              insights.lowStockProductsCount > 0 ? "bg-destructive/10 text-destructive" : "bg-emerald-500/10 text-emerald-500"
            }`}>
              <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M10.29 3.86L1.82 18a2 2 0 0 0 1.71 3h16.94a2 2 0 0 0 1.71-3L13.71 3.86a2 2 0 0 0-3.42 0z"/><line x1="12" y1="9" x2="12" y2="13"/><line x1="12" y1="17" x2="12.01" y2="17"/></svg>
            </div>
          </div>
          <div className="flex flex-col gap-1 mt-4">
            <div className={`text-3xl font-bold ${insights.lowStockProductsCount > 0 ? "text-destructive" : "text-emerald-500"}`}>
              {insights.lowStockProductsCount}
            </div>
            <p className="text-xs text-muted-foreground">
              {insights.lowStockProductsCount > 0 ? "Require replenishment attention" : "All stock levels normal"}
            </p>
          </div>
        </div>
      </section>

      {/* Low Stock Alerts list */}
      <section className="flex flex-col rounded-xl border bg-card shadow-sm transition-all hover:shadow-md mt-2">
        <div className="border-b border-border/50 p-6 flex items-center justify-between">
          <div>
            <h3 className="text-lg font-semibold tracking-tight">Low Stock Products</h3>
            <p className="text-sm text-muted-foreground">Products that need replenishment (Quantity &lt; 5).</p>
          </div>
          <span className={`inline-flex h-7 items-center justify-center rounded-full px-3 text-xs font-semibold ${
            insights.lowStockProductsCount > 0 ? "bg-destructive/10 text-destructive" : "bg-emerald-500/10 text-emerald-500"
          }`}>
            {insights.lowStockProductsCount} Items
          </span>
        </div>

        {insights.lowStockProducts.length === 0 ? (
          <div className="flex min-h-[220px] flex-col items-center justify-center p-8 text-muted-foreground text-center bg-muted/10 rounded-b-xl">
             <div className="flex h-12 w-12 items-center justify-center rounded-full bg-emerald-500/10 text-emerald-500 mb-3">
               <svg xmlns="http://www.w3.org/2000/svg" width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><path d="M20 6 9 17l-5-5"/></svg>
             </div>
             <p className="font-semibold text-foreground">All Clear!</p>
             <p className="text-sm mt-1 opacity-70">No products are currently low on stock.</p>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full border-collapse text-left text-sm text-muted-foreground">
              <thead className="bg-muted/30 text-xs font-semibold uppercase text-foreground border-b border-border/50">
                <tr>
                  <th className="px-6 py-3">Image</th>
                  <th className="px-6 py-3">Name / SKU</th>
                  <th className="px-6 py-3">Selling Price</th>
                  <th className="px-6 py-3 text-right">Available Stock</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-border/50">
                {insights.lowStockProducts.map((product: any) => (
                  <tr key={product.id} className="transition-colors hover:bg-muted/10">
                    <td className="px-6 py-3">
                      <div className="h-10 w-10 overflow-hidden rounded-lg border bg-muted flex items-center justify-center">
                        {product.image ? (
                          // eslint-disable-next-line @next/next/no-img-element
                          <img
                            src={product.image}
                            alt={product.name}
                            className="h-full w-full object-cover"
                          />
                        ) : (
                          <svg className="h-5 w-5 opacity-30" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2"><rect width="18" height="18" x="3" y="3" rx="2" ry="2"/><circle cx="9" cy="9" r="2"/><path d="m21 15-3.086-3.086a2 2 0 0 0-2.828 0L6 21"/></svg>
                        )}
                      </div>
                    </td>
                    <td className="px-6 py-3">
                      <div className="flex flex-col">
                        <span className="font-semibold text-foreground">{product.name}</span>
                        <span className="text-[10px] font-mono text-muted-foreground">{product.sku}</span>
                      </div>
                    </td>
                    <td className="px-6 py-3 font-semibold text-foreground">
                      ${product.sellingPrice.toLocaleString()}
                    </td>
                    <td className="px-6 py-3 text-right">
                      <span className={`inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-bold ring-1 ring-inset ${
                        product.stockQuantity === 0
                          ? "bg-destructive/10 text-destructive ring-destructive/20"
                          : "bg-amber-500/10 text-amber-500 ring-amber-500/20"
                      }`}>
                        {product.stockQuantity === 0 ? "Out of Stock" : `${product.stockQuantity} Left`}
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </section>
    </div>
  );
}
