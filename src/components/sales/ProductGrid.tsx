"use client";

import React from "react";
import Loader from "@/components/ui/Loader";
import { Product, Category } from "@/types";
import ProductSearchFilters from "./ProductSearchFilters";
import ProductCard from "./ProductCard";

interface ProductGridProps {
  products: Product[];
  categories: Category[];
  isLoading: boolean;
  isError: boolean;
  searchTerm: string;
  setSearchTerm: (term: string) => void;
  categoryId: string;
  setCategoryId: (id: string) => void;
  onAddToCart: (product: Product) => void;
  cartQuantities: Record<string, number>;
  page: number;
  totalPages: number;
  totalItems: number;
  onPageChange: (page: number) => void;
}

export default function ProductGrid({
  products,
  categories,
  isLoading,
  isError,
  searchTerm,
  setSearchTerm,
  categoryId,
  setCategoryId,
  onAddToCart,
  cartQuantities,
  page,
  totalPages,
  totalItems,
  onPageChange,
}: ProductGridProps) {
  return (
    <div className="flex flex-col gap-6 h-full">
      {/* Search and Filters */}
      <ProductSearchFilters
        searchTerm={searchTerm}
        setSearchTerm={setSearchTerm}
        categoryId={categoryId}
        setCategoryId={setCategoryId}
        categories={categories}
      />

      {/* Products Grid */}
      <div className="flex-1 overflow-y-auto pr-1">
        {isLoading ? (
          <Loader minHeight="min-h-[250px]" />
        ) : isError || products.length === 0 ? (
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
              strokeLinecap="round"
              strokeLinejoin="round"
            >
              <rect width="20" height="14" x="2" y="3" rx="2" />
              <line x1="12" y1="17" x2="12" y2="21" />
              <line x1="3" y1="9" x2="21" y2="9" />
            </svg>
            <h3 className="text-lg font-semibold text-foreground">No products available</h3>
            <p className="text-sm mt-1">Try resetting your filters or search keywords.</p>
          </div>
        ) : (
          <div className="flex flex-col gap-4">
            <div className="grid gap-4 grid-cols-1 sm:grid-cols-2 lg:grid-cols-3">
              {products.map((product) => (
                <ProductCard
                  key={product.id}
                  product={product}
                  inCartQty={cartQuantities[product.id] || 0}
                  onAddToCart={onAddToCart}
                />
              ))}
            </div>

            {/* Pagination Controls */}
            {totalPages > 1 && (
              <div className="flex items-center justify-between border-t pt-4 mt-2">
                <span className="text-xs text-muted-foreground">
                  Page {page} of {totalPages} ({totalItems} items)
                </span>
                <div className="flex gap-2">
                  <button
                    onClick={() => onPageChange(Math.max(page - 1, 1))}
                    disabled={page === 1}
                    className="inline-flex h-8 items-center justify-center rounded-md border bg-background px-3 text-xs font-semibold disabled:opacity-40 transition-all hover:bg-accent"
                  >
                    Previous
                  </button>
                  <button
                    onClick={() => onPageChange(Math.min(page + 1, totalPages))}
                    disabled={page === totalPages}
                    className="inline-flex h-8 items-center justify-center rounded-md border bg-background px-3 text-xs font-semibold disabled:opacity-40 transition-all hover:bg-accent"
                  >
                    Next
                  </button>
                </div>
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
}
