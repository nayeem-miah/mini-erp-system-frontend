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
