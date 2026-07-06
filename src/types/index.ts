import React from "react";

export type UserRole = "ADMIN" | "MANAGER" | "EMPLOYEE";

export interface User {
  id: string;
  name: string;
  email: string;
  role: UserRole;
}

export interface Category {
  id: string;
  name: string;
  createdAt: string;
  updatedAt: string;
}

export interface Product {
  id: string;
  name: string;
  sku: string;
  purchasePrice: number;
  sellingPrice: number;
  stockQuantity: number;
  image: string;
  categoryId: string;
  category?: Category;
  createdAt: string;
  updatedAt: string;
}

export interface ProductTableProps {
  products: Product[];
  isLoading: boolean;
  isError: boolean;
  canManage: boolean;
  onEdit: (product: Product) => void;
  onDelete: (id: string) => void;
  page: number;
  totalPages: number;
  totalItems: number;
  onPageChange: (page: number) => void;
}

export interface ProductModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (e: React.FormEvent) => void;
  title: string;
  isSubmitting: boolean;
  formData: {
    name: string;
    categoryId: string;
    purchasePrice: string;
    sellingPrice: string;
    stockQuantity: string;
  };
  handleInputChange: (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => void;
  handleImageChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  categories: Category[];
  mode: "add" | "edit";
  imagePreview?: string | null;
}

export interface SaleItem {
  productId: string;
  quantity: number;
  price: number;
  productName: string;
  productSku: string;
  productImage: string;
}

export interface Sale {
  id: string;
  items: SaleItem[];
  grandTotal: number;
  saleDate: string;
  userId: string;
  createdAt: string;
  updatedAt: string;
  user: {
    id: string;
    name: string;
    email: string;
  };
}

export interface ProductSearchFiltersProps {
  searchTerm: string;
  setSearchTerm: (term: string) => void;
  categoryId: string;
  setCategoryId: (id: string) => void;
  categories: Category[];
}

export interface SalesTableProps {
  sales: Sale[];
  isLoading: boolean;
  isError: boolean;
}

export interface ProductCardProps {
  product: Product;
  inCartQty: number;
  onAddToCart: (product: Product) => void;
}
