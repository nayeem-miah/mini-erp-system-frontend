/* eslint-disable react-hooks/set-state-in-effect */
/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";

import CartPanel, { CartItem } from "@/components/sales/CartPanel";
import ProductGrid from "@/components/sales/ProductGrid";
import SalesTable from "@/components/sales/SalesTable";
import { useAuth } from "@/context/AuthContext";
import { useGetCategoriesQuery } from "@/redux/api/categoriesApi";
import { useGetProductsQuery } from "@/redux/api/productsApi";
import {
  useCreateSaleMutation,
} from "@/redux/api/salesApi";
import { Product } from "@/types";
import { useEffect, useState } from "react";
import { toast } from "sonner";

export default function SalesPage() {
  const { user } = useAuth();
  const [activeTab, setActiveTab] = useState<"pos" | "history">("pos");


  const [cartItems, setCartItems] = useState<CartItem[]>([]);


  const [searchTerm, setSearchTerm] = useState("");
  const [debouncedSearch, setDebouncedSearch] = useState("");
  const [categoryId, setCategoryId] = useState("");
  const [productPage, setProductPage] = useState(1);
  const productLimit = 6;

  useEffect(() => {
    const timer = setTimeout(() => {
      setDebouncedSearch(searchTerm);
    }, 400);
    return () => clearTimeout(timer);
  }, [searchTerm]);

  // Reset page when search or category changes
  useEffect(() => {
    setProductPage(1);
  }, [debouncedSearch, categoryId]);

  const { data: categoriesResponse } = useGetCategoriesQuery(undefined);
  const categories = categoriesResponse?.data || [];

  const {
    data: productsResponse,
    isLoading: isProductsLoading,
    isError: isProductsError,
  } = useGetProductsQuery({
    page: productPage,
    limit: productLimit,
    searchTerm: debouncedSearch,
    categoryId: categoryId || undefined,
  });
  const products = productsResponse?.data?.data || [];
  const productMeta = productsResponse?.data?.meta || { page: 1, limit: 6, total: 0, totalPages: 1 };


  const isManagerOrAdmin = user?.role === "ADMIN" || user?.role === "MANAGER";


  const [createSale, { isLoading: isCheckingOut }] = useCreateSaleMutation();


  const cartQuantities = cartItems.reduce((acc, item) => {
    acc[item.product.id] = item.quantity;
    return acc;
  }, {} as Record<string, number>);

  const handleAddToCart = (product: Product) => {
    setCartItems((prev) => {
      const existing = prev.find((item) => item.product.id === product.id);
      if (existing) {

        if (existing.quantity >= product.stockQuantity) {
          toast.error(`Cannot add more. Only ${product.stockQuantity} in stock.`);
          return prev;
        }
        return prev.map((item) =>
          item.product.id === product.id
            ? { ...item, quantity: item.quantity + 1 }
            : item
        );
      }
      return [...prev, { product, quantity: 1 }];
    });
    toast.success(`${product.name} added to cart`);
  };

  const handleUpdateQuantity = (productId: string, quantity: number) => {
    if (quantity <= 0) {
      handleRemoveItem(productId);
      return;
    }

    setCartItems((prev) =>
      prev.map((item) => {
        if (item.product.id === productId) {
          const maxStock = item.product.stockQuantity;
          if (quantity > maxStock) {
            toast.error(`Only ${maxStock} items available in stock.`);
            return item;
          }
          return { ...item, quantity };
        }
        return item;
      })
    );
  };

  const handleRemoveItem = (productId: string) => {
    setCartItems((prev) => prev.filter((item) => item.product.id !== productId));
    toast.info("Item removed from cart");
  };

  const handleCheckout = async () => {
    if (cartItems.length === 0) return;

    try {
      const payload = {
        items: cartItems.map((item) => ({
          productId: item.product.id,
          quantity: item.quantity,
        })),
      };

      const response = await createSale(payload).unwrap();
      if (response.success) {
        toast.success("Transaction recorded successfully!");
        setCartItems([]);
        setActiveTab("history");
      } else {
        toast.error(response.message || "Failed to complete checkout.");
      }
    } catch (err: any) {
      console.error("Checkout failed:", err);
      toast.error(err?.data?.message || err?.message || "An error occurred during checkout.");
    }
  };

  if (!user) return null;

  return (
    <div className="flex flex-col gap-6 h-full min-h-[calc(100vh-140px)]">
      {/* Title Header */}
      <section className="flex flex-col gap-1.5 sm:flex-row sm:items-center sm:justify-between border-b pb-4">
        <div>
          <h2 className="text-3xl font-extrabold tracking-tight text-foreground">Sales Hub</h2>
          <p className="text-sm text-muted-foreground">
            Manage transactions, build orders, and analyze checkout history.
          </p>
        </div>

        {/* Tab Controls */}
        <div className="flex gap-1.5 rounded-xl bg-muted p-1 self-start sm:self-center">
          <button
            onClick={() => setActiveTab("pos")}
            className={`flex items-center gap-1.5 rounded-lg px-4 py-2 text-sm font-semibold transition-all duration-200 ${
              activeTab === "pos"
                ? "bg-background text-foreground shadow-sm"
                : "text-muted-foreground hover:text-foreground"
            }`}
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
              <rect width="20" height="12" x="2" y="6" rx="2" />
              <circle cx="12" cy="12" r="2" />
              <path d="M6 12h.01M18 12h.01" />
            </svg>
            POS Terminal
          </button>
          <button
            onClick={() => setActiveTab("history")}
            className={`flex items-center gap-1.5 rounded-lg px-4 py-2 text-sm font-semibold transition-all duration-200 ${
              activeTab === "history"
                ? "bg-background text-foreground shadow-sm"
                : "text-muted-foreground hover:text-foreground"
            }`}
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
              <path d="M12 20h9" />
              <path d="M16.5 3.5a2.12 2.12 0 0 1 3 3L7 19l-4 1 1-4Z" />
            </svg>
            Sales History
          </button>
        </div>
      </section>

      {/* Content Area */}
      <div className="flex-1">
        {activeTab === "pos" ? (
          <div className="grid gap-6 grid-cols-1 lg:grid-cols-3 items-start h-full">
            {/* Products grid browser (left column - spans 2 on desktop) */}
            <div className="lg:col-span-2 h-full">
              <ProductGrid
                products={products}
                categories={categories}
                isLoading={isProductsLoading}
                isError={isProductsError}
                searchTerm={searchTerm}
                setSearchTerm={setSearchTerm}
                categoryId={categoryId}
                setCategoryId={setCategoryId}
                onAddToCart={handleAddToCart}
                cartQuantities={cartQuantities}
                page={productPage}
                totalPages={productMeta.totalPages}
                totalItems={productMeta.total}
                onPageChange={setProductPage}
              />
            </div>

            {/* Shopping Cart Drawer (right column - spans 1 on desktop) */}
            <div className="lg:col-span-1 h-full lg:sticky lg:top-6">
              <CartPanel
                cartItems={cartItems}
                onUpdateQuantity={handleUpdateQuantity}
                onRemoveItem={handleRemoveItem}
                onCheckout={handleCheckout}
                isCheckingOut={isCheckingOut}
              />
            </div>
          </div>
        ) : (
          /* Sales History List (spans full width) */
          <div className="w-full">
            <SalesTable />
          </div>
        )}
      </div>
    </div>
  );
}
