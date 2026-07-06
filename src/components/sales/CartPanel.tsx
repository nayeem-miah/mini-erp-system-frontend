"use client";

import React from "react";
import { Product } from "@/types";

export interface CartItem {
  product: Product;
  quantity: number;
}

interface CartPanelProps {
  cartItems: CartItem[];
  onUpdateQuantity: (productId: string, quantity: number) => void;
  onRemoveItem: (productId: string) => void;
  onCheckout: () => void;
  isCheckingOut: boolean;
}

export default function CartPanel({
  cartItems,
  onUpdateQuantity,
  onRemoveItem,
  onCheckout,
  isCheckingOut,
}: CartPanelProps) {
  const subtotal = cartItems.reduce(
    (acc, item) => acc + item.product.sellingPrice * item.quantity,
    0
  );
  
  // Optional simulated tax (e.g., 5% or 0% for base ERP)
  const tax = 0; 
  const grandTotal = subtotal + tax;

  return (
    <div className="flex flex-col h-full rounded-2xl border bg-card shadow-lg overflow-hidden">
      {/* Header */}
      <div className="border-b px-6 py-4 bg-muted/20">
        <h3 className="text-lg font-bold text-foreground flex items-center justify-between">
          Active Cart
          {cartItems.length > 0 && (
            <span className="inline-flex items-center rounded-full bg-primary/10 px-2.5 py-0.5 text-xs font-semibold text-primary">
              {cartItems.reduce((acc, item) => acc + item.quantity, 0)} Items
            </span>
          )}
        </h3>
      </div>

      {/* Cart List */}
      <div className="flex-1 overflow-y-auto px-6 py-4 flex flex-col gap-4">
        {cartItems.length === 0 ? (
          <div className="flex-1 flex flex-col items-center justify-center text-muted-foreground text-center py-12">
            <div className="h-16 w-16 rounded-full bg-muted flex items-center justify-center mb-4">
              <svg
                className="h-8 w-8 opacity-45"
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
                <circle cx="8" cy="21" r="1" />
                <circle cx="19" cy="21" r="1" />
                <path d="M2.05 2.05h2l2.66 12.42a2 2 0 0 0 2 1.58h9.78a2 2 0 0 0 1.95-1.57l1.65-7.43H5.12" />
              </svg>
            </div>
            <p className="font-semibold text-foreground text-sm">Your cart is empty</p>
            <p className="text-xs mt-1">Select products on the left terminal to build a sale.</p>
          </div>
        ) : (
          cartItems.map((item) => {
            const maxStock = item.product.stockQuantity;
            const itemTotal = item.product.sellingPrice * item.quantity;

            return (
              <div
                key={item.product.id}
                className="flex gap-3 items-center border-b pb-4 last:border-0 last:pb-0"
              >
                {/* Product Thumbnail */}
                <div className="h-12 w-12 shrink-0 overflow-hidden rounded-lg border bg-muted flex items-center justify-center">
                  {item.product.image ? (
                    // eslint-disable-next-line @next/next/no-img-element
                    <img
                      src={item.product.image}
                      alt={item.product.name}
                      className="h-full w-full object-cover"
                    />
                  ) : (
                    <svg
                      className="h-5 w-5 opacity-30"
                      xmlns="http://www.w3.org/2000/svg"
                      width="24"
                      height="24"
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

                {/* Info & Quantity controls */}
                <div className="flex-1 min-w-0">
                  <h4 className="text-sm font-semibold text-foreground truncate" title={item.product.name}>
                    {item.product.name}
                  </h4>
                  <div className="flex justify-between items-center mt-1">
                    <span className="text-xs text-muted-foreground font-mono">
                      ${item.product.sellingPrice.toLocaleString()} each
                    </span>
                    <span className="text-xs text-muted-foreground">
                      Max: {maxStock}
                    </span>
                  </div>

                  {/* Quantity Actions */}
                  <div className="flex justify-between items-center mt-2">
                    <div className="flex items-center gap-1.5 border rounded-lg bg-background p-0.5">
                      <button
                        onClick={() => onUpdateQuantity(item.product.id, item.quantity - 1)}
                        className="h-6 w-6 inline-flex items-center justify-center rounded-md hover:bg-muted text-muted-foreground hover:text-foreground text-xs font-bold transition-colors"
                      >
                        -
                      </button>
                      <span className="w-8 text-center text-xs font-semibold text-foreground">
                        {item.quantity}
                      </span>
                      <button
                        onClick={() => onUpdateQuantity(item.product.id, item.quantity + 1)}
                        disabled={item.quantity >= maxStock}
                        className={`h-6 w-6 inline-flex items-center justify-center rounded-md text-xs font-bold transition-colors ${
                          item.quantity >= maxStock
                            ? "text-muted-foreground bg-muted/50 cursor-not-allowed"
                            : "hover:bg-muted text-muted-foreground hover:text-foreground"
                        }`}
                      >
                        +
                      </button>
                    </div>

                    <button
                      onClick={() => onRemoveItem(item.product.id)}
                      className="text-destructive hover:text-destructive/80 p-1 rounded-md hover:bg-destructive/10 transition-colors"
                      title="Remove product"
                    >
                      <svg
                        className="h-4 w-4"
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
                        <path d="M3 6h18" />
                        <path d="M19 6v14c0 1-1 2-2 2H7c-1 0-2-1-2-2V6" />
                        <path d="M8 6V4c0-1 1-2 2-2h4c1 0 2 1 2 2v2" />
                      </svg>
                    </button>
                  </div>
                </div>

                {/* Total Item Price */}
                <div className="text-right shrink-0">
                  <span className="text-sm font-bold text-foreground">
                    ${itemTotal.toLocaleString()}
                  </span>
                </div>
              </div>
            );
          })
        )}
      </div>

      {/* Summary and Submit */}
      {cartItems.length > 0 && (
        <div className="border-t bg-muted/20 px-6 py-6 flex flex-col gap-4">
          <div className="flex flex-col gap-2">
            <div className="flex justify-between text-sm text-muted-foreground">
              <span>Subtotal</span>
              <span className="font-semibold text-foreground">${subtotal.toLocaleString()}</span>
            </div>
            {tax > 0 && (
              <div className="flex justify-between text-sm text-muted-foreground">
                <span>Tax</span>
                <span className="font-semibold text-foreground">${tax.toLocaleString()}</span>
              </div>
            )}
            <div className="border-t border-dashed my-1"></div>
            <div className="flex justify-between text-base font-bold text-foreground">
              <span>Total Price</span>
              <span className="text-lg text-primary">${grandTotal.toLocaleString()}</span>
            </div>
          </div>

          <button
            onClick={onCheckout}
            disabled={isCheckingOut}
            className="w-full bg-primary hover:bg-primary/90 text-primary-foreground font-semibold py-3 px-4 rounded-xl shadow-md transition-all flex items-center justify-center gap-2 hover:shadow-lg disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {isCheckingOut ? (
              <>
                <svg
                  className="animate-spin h-5 w-5 text-current"
                  xmlns="http://www.w3.org/2000/svg"
                  fill="none"
                  viewBox="0 0 24 24"
                >
                  <circle
                    className="opacity-25"
                    cx="12"
                    cy="12"
                    r="10"
                    stroke="currentColor"
                    strokeWidth="4"
                  ></circle>
                  <path
                    className="opacity-75"
                    fill="currentColor"
                    d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                  ></path>
                </svg>
                Processing Sale...
              </>
            ) : (
              <>
                <svg
                  className="h-5 w-5"
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
                  <circle cx="12" cy="12" r="10" />
                  <path d="m9 12 2 2 4-4" />
                </svg>
                Checkout & Record Sale
              </>
            )}
          </button>
        </div>
      )}
    </div>
  );
}
