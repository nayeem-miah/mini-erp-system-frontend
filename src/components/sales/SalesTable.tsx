"use client";

import Loader from "@/components/ui/Loader";
import { SalesTableProps } from "@/types";
import React, { useState } from "react";
import CustomSelect from "../ui/CustomSelect";

export default function SalesTable({ sales, isLoading, isError }: SalesTableProps) {
  const [expandedSaleId, setExpandedSaleId] = useState<string | null>(null);


  const [searchTerm, setSearchTerm] = useState("");
  const [dateFilter, setDateFilter] = useState("all");

  const toggleRow = (saleId: string) => {
    setExpandedSaleId((prev) => (prev === saleId ? null : saleId));
  };


  const isDateInRange = (dateStr: string, range: string) => {
    const saleDate = new Date(dateStr);
    const today = new Date();
    today.setHours(0, 0, 0, 0);

    if (range === "today") {
      return saleDate >= today;
    } else if (range === "week") {
      const oneWeekAgo = new Date();
      oneWeekAgo.setDate(today.getDate() - 7);
      return saleDate >= oneWeekAgo;
    } else if (range === "month") {
      const oneMonthAgo = new Date();
      oneMonthAgo.setMonth(today.getMonth() - 1);
      return saleDate >= oneMonthAgo;
    }
    return true;
  };


  const filteredSales = sales.filter((sale) => {
    const matchesSearch =
      sale.id.toLowerCase().includes(searchTerm.toLowerCase()) ||
      sale.user.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      sale.user.email.toLowerCase().includes(searchTerm.toLowerCase());

    const matchesDate = isDateInRange(sale.saleDate, dateFilter);

    return matchesSearch && matchesDate;
  });


  const totalRevenue = filteredSales.reduce((acc, sale) => acc + sale.grandTotal, 0);
  const totalTransactions = filteredSales.length;
  const avgOrderValue = totalTransactions > 0 ? totalRevenue / totalTransactions : 0;

  if (isLoading) {
    return <Loader minHeight="min-h-[300px]" />;
  }

  if (isError) {
    return (
      <div className="flex min-h-[300px] flex-col items-center justify-center p-8 text-destructive text-center">
        <svg
          className="mb-4 h-12 w-12 opacity-50"
          xmlns="http://www.w3.org/2000/svg"
          fill="none"
          viewBox="0 0 24 24"
          stroke="currentColor"
          strokeWidth="2"
        >
          <path strokeLinecap="round" strokeLinejoin="round" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
        </svg>
        <p className="font-semibold text-lg">Error loading sales history</p>
        <p className="text-sm opacity-70">Please check your network or try again later.</p>
      </div>
    );
  }

  return (
    <div className="flex flex-col gap-6">
      {/* Overview Cards */}
      <div className="grid gap-4 grid-cols-1 sm:grid-cols-3">
        <div className="flex flex-col justify-between rounded-xl border bg-card p-5 shadow-sm">
          <span className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">Total Revenue</span>
          <div className="flex flex-col mt-2">
            <span className="text-2xl font-bold text-foreground">${totalRevenue.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}</span>
            <span className="text-[10px] text-muted-foreground mt-1">Based on current filters</span>
          </div>
        </div>

        <div className="flex flex-col justify-between rounded-xl border bg-card p-5 shadow-sm">
          <span className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">Transactions</span>
          <div className="flex flex-col mt-2">
            <span className="text-2xl font-bold text-foreground">{totalTransactions}</span>
            <span className="text-[10px] text-muted-foreground mt-1">Sales successfully processed</span>
          </div>
        </div>

        <div className="flex flex-col justify-between rounded-xl border bg-card p-5 shadow-sm">
          <span className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">Avg. Sale Value</span>
          <div className="flex flex-col mt-2">
            <span className="text-2xl font-bold text-foreground">${avgOrderValue.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}</span>
            <span className="text-[10px] text-muted-foreground mt-1">Revenue per transaction</span>
          </div>
        </div>
      </div>

      {/* Filters Bar */}
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div className="relative flex-1">
          <svg
            className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground"
            xmlns="http://www.w3.org/2000/svg"
            width="24"
            height="24"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
          >
            <circle cx="11" cy="11" r="8" />
            <path d="m21 21-4.3-4.3" />
          </svg>
          <input
            type="text"
            placeholder="Search by transaction ID, employee name, email..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full rounded-xl border border-input bg-background py-2.5 pl-10 pr-4 text-sm ring-offset-background placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary focus-visible:ring-offset-2"
          />
        </div>

        <CustomSelect
          options={[
            { value: "all", label: "All Dates" },
            { value: "today", label: "Today" },
            { value: "week", label: "Last 7 Days" },
            { value: "month", label: "Last 30 Days" },
          ]}
          value={dateFilter}
          onChange={setDateFilter}
          placeholder="All Dates"
          className="sm:w-[200px]"
        />
      </div>

      {/* Main Table */}
      {filteredSales.length === 0 ? (
        <div className="flex min-h-[250px] flex-col items-center justify-center rounded-2xl border border-dashed p-8 text-center text-muted-foreground">
          <svg
            className="mb-4 h-12 w-12 opacity-30"
            xmlns="http://www.w3.org/2000/svg"
            width="24"
            height="24"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="1.5"
          >
            <path strokeLinecap="round" strokeLinejoin="round" d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
          </svg>
          <h3 className="text-lg font-semibold text-foreground">No transactions found</h3>
          <p className="text-sm mt-1">Try relaxing your search terms or filters.</p>
        </div>
      ) : (
        <div className="rounded-xl border bg-card shadow-sm overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full border-collapse text-left text-sm text-muted-foreground">
              <thead className="bg-muted/50 text-xs font-semibold uppercase text-foreground border-b border-border/50">
                <tr>
                  <th className="px-6 py-4 w-[60px]"></th>
                  <th className="px-6 py-4">Transaction ID</th>
                  <th className="px-6 py-4">Date & Time</th>
                  <th className="px-6 py-4">Sold By</th>
                  <th className="px-6 py-4">Items Count</th>
                  <th className="px-6 py-4 text-right">Grand Total</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-border/50">
                {filteredSales.map((sale) => {
                  const isExpanded = expandedSaleId === sale.id;
                  const totalItems = sale.items.reduce((sum, item) => sum + item.quantity, 0);

                  return (
                    <React.Fragment key={sale.id}>
                      {/* Parent Row */}
                      <tr
                        onClick={() => toggleRow(sale.id)}
                        className={`transition-colors hover:bg-muted/30 cursor-pointer ${
                          isExpanded ? "bg-muted/20" : ""
                        }`}
                      >
                        <td className="px-6 py-4 text-center">
                          <button
                            className="text-muted-foreground hover:text-foreground transition-transform duration-200"
                            style={{ transform: isExpanded ? "rotate(90deg)" : "rotate(0deg)" }}
                          >
                            <svg
                              className="h-4 w-4"
                              xmlns="http://www.w3.org/2000/svg"
                              viewBox="0 0 24 24"
                              fill="none"
                              stroke="currentColor"
                              strokeWidth="2.5"
                              strokeLinecap="round"
                              strokeLinejoin="round"
                            >
                              <path d="m9 18 6-6-6-6" />
                            </svg>
                          </button>
                        </td>
                        <td className="px-6 py-4 font-mono text-xs font-bold text-foreground">
                          {sale.id.slice(-8).toUpperCase()}...
                        </td>
                        <td className="px-6 py-4 text-xs">
                          {new Date(sale.saleDate).toLocaleString(undefined, {
                            dateStyle: "medium",
                            timeStyle: "short",
                          })}
                        </td>
                        <td className="px-6 py-4">
                          <div className="flex flex-col">
                            <span className="font-semibold text-foreground text-xs leading-tight">
                              {sale.user.name}
                            </span>
                            <span className="text-[10px] text-muted-foreground leading-normal">
                              {sale.user.email}
                            </span>
                          </div>
                        </td>
                        <td className="px-6 py-4 font-semibold text-foreground text-xs">
                          {totalItems} items
                        </td>
                        <td className="px-6 py-4 text-right font-bold text-foreground text-sm">
                          ${sale.grandTotal.toLocaleString(undefined, { minimumFractionDigits: 2 })}
                        </td>
                      </tr>

                      {/* Expandable Details Row */}
                      {isExpanded && (
                        <tr>
                          <td colSpan={6} className="bg-muted/10 px-8 py-5 border-t border-b">
                            <div className="flex flex-col gap-4 animate-fadeIn">
                              <div className="flex justify-between items-center border-b pb-2">
                                <h5 className="text-xs font-bold text-foreground uppercase tracking-wider">
                                  Transaction Receipt Details
                                </h5>
                                <span className="text-[10px] text-muted-foreground font-mono">
                                  UUID: {sale.id}
                                </span>
                              </div>

                              {/* Items List */}
                              <div className="grid gap-3">
                                {sale.items.map((item, idx) => (
                                  <div
                                    key={idx}
                                    className="flex items-center justify-between py-1.5 border-b border-border/30 last:border-0 last:pb-0"
                                  >
                                    <div className="flex items-center gap-3">
                                      <div className="h-9 w-9 overflow-hidden rounded-md border bg-muted flex items-center justify-center shrink-0">
                                        {item.productImage ? (
                                          // eslint-disable-next-line @next/next/no-img-element
                                          <img
                                            src={item.productImage}
                                            alt={item.productName}
                                            className="h-full w-full object-cover"
                                          />
                                        ) : (
                                          <svg
                                            className="h-4 w-4 opacity-30"
                                            xmlns="http://www.w3.org/2000/svg"
                                            viewBox="0 0 24 24"
                                            fill="none"
                                            stroke="currentColor"
                                            strokeWidth="2"
                                          >
                                            <rect width="18" height="18" x="3" y="3" rx="2" ry="2" />
                                            <circle cx="9" cy="9" r="2" />
                                            <path d="m21 15-3.086-3.086a2 2 0 0 0-2.828 0L6 21" />
                                          </svg>
                                        )}
                                      </div>

                                      <div className="flex flex-col">
                                        <span className="font-semibold text-foreground text-xs">
                                          {item.productName}
                                        </span>
                                        <span className="text-[9px] text-muted-foreground font-mono">
                                          SKU: {item.productSku}
                                        </span>
                                      </div>
                                    </div>

                                    <div className="flex items-center gap-8 text-xs">
                                      <span className="text-muted-foreground">
                                        {item.quantity} x ${item.price.toLocaleString()}
                                      </span>
                                      <span className="font-bold text-foreground text-right w-[80px]">
                                        ${(item.quantity * item.price).toLocaleString()}
                                      </span>
                                    </div>
                                  </div>
                                ))}
                              </div>

                              {/* Receipt Footer */}
                              <div className="flex justify-end pt-2 border-t">
                                <div className="w-[200px] flex flex-col gap-1.5 text-xs text-muted-foreground">
                                  <div className="flex justify-between font-bold text-foreground">
                                    <span>Total Paid</span>
                                    <span className="text-sm text-primary font-extrabold">
                                      ${sale.grandTotal.toLocaleString()}
                                    </span>
                                  </div>
                                </div>
                              </div>
                            </div>
                          </td>
                        </tr>
                      )}
                    </React.Fragment>
                  );
                })}
              </tbody>
            </table>
          </div>
        </div>
      )}
    </div>
  );
}
