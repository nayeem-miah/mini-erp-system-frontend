"use client";

import React from "react";
import { ProductCardProps } from "@/types";

export default function ProductCard({ product, inCartQty, onAddToCart }: ProductCardProps) {
  const remainingStock = product.stockQuantity - inCartQty;
  const isOutOfStock = remainingStock <= 0;

  return (
    <div
      className={`group flex flex-col justify-between overflow-hidden rounded-xl border bg-card shadow-sm transition-all hover:shadow-md hover:border-primary/20 ${
        isOutOfStock ? "opacity-75" : ""
      }`}
    >
      <div className="p-4">
        {/* Image section */}
        <div className="relative aspect-square w-full overflow-hidden rounded-lg border bg-muted flex items-center justify-center mb-4">
          {product.image ? (
            // eslint-disable-next-line @next/next/no-img-element
            <img
              src={product.image}
              alt={product.name}
              className="h-full w-full object-cover transition-transform duration-300 group-hover:scale-105"
            />
          ) : (
            <svg
              className="h-10 w-10 opacity-30"
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
              <rect width="18" height="18" x="3" y="3" rx="2" ry="2" />
              <circle cx="9" cy="9" r="2" />
              <path d="m21 15-3.086-3.086a2 2 0 0 0-2.828 0L6 21" />
            </svg>
          )}

          {/* Stock badge */}
          <div className="absolute right-2 top-2">
            {product.stockQuantity === 0 ? (
              <span className="inline-flex items-center rounded-full bg-destructive/10 px-2.5 py-0.5 text-xs font-semibold text-destructive ring-1 ring-inset ring-destructive/20">
                Out of Stock
              </span>
            ) : product.stockQuantity < 5 ? (
              <span className="inline-flex items-center rounded-full bg-amber-500/10 px-2.5 py-0.5 text-xs font-semibold text-amber-500 ring-1 ring-inset ring-amber-500/20">
                Low Stock: {product.stockQuantity}
              </span>
            ) : (
              <span className="inline-flex items-center rounded-full bg-emerald-500/10 px-2.5 py-0.5 text-xs font-semibold text-emerald-500 ring-1 ring-inset ring-emerald-500/20">
                Stock: {product.stockQuantity}
              </span>
            )}
          </div>
        </div>

        {/* Details */}
        <div className="flex flex-col gap-1">
          <span className="font-mono text-xs text-muted-foreground">{product.sku}</span>
          <h4 className="font-semibold text-foreground line-clamp-1 group-hover:text-primary transition-colors">
            {product.name}
          </h4>
          <span className="text-xs text-muted-foreground">
            Category: {product.category?.name || "N/A"}
          </span>
        </div>
      </div>

      {/* Actions / Add to Cart */}
      <div className="border-t bg-muted/30 px-4 py-3 flex items-center justify-between">
        <span className="font-bold text-lg text-foreground">
          ${product.sellingPrice.toLocaleString()}
        </span>

        <button
          onClick={() => onAddToCart(product)}
          disabled={isOutOfStock}
          className={`inline-flex items-center gap-1.5 rounded-lg px-3 py-1.5 text-xs font-semibold shadow-sm transition-all ${
            isOutOfStock
              ? "bg-muted text-muted-foreground cursor-not-allowed border"
              : inCartQty > 0
              ? "bg-primary/10 text-primary border border-primary/20 hover:bg-primary/20"
              : "bg-primary text-primary-foreground hover:bg-primary/90"
          }`}
        >
          {inCartQty > 0 ? (
            <>
              <svg
                className="h-3.5 w-3.5"
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
                <path d="M20 6 9 17l-5-5" />
              </svg>
              Added ({inCartQty})
            </>
          ) : (
            <>
              <svg
                className="h-3.5 w-3.5"
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
                <circle cx="8" cy="21" r="1" />
                <circle cx="19" cy="21" r="1" />
                <path d="M2.05 2.05h2l2.66 12.42a2 2 0 0 0 2 1.58h9.78a2 2 0 0 0 1.95-1.57l1.65-7.43H5.12" />
              </svg>
              Add to Cart
            </>
          )}
        </button>
      </div>
    </div>
  );
}
