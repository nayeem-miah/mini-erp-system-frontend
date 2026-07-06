/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";

import ProductModal from "@/components/products/ProductModal";
import ProductTable from "@/components/products/ProductTable";
import ConfirmModal from "@/components/ui/ConfirmModal";
import CustomSelect from "@/components/ui/CustomSelect";
import { useAuth } from "@/context/AuthContext";
import { useGetCategoriesQuery } from "@/redux/api/categoriesApi";
import {
  useCreateProductMutation,
  useDeleteProductMutation,
  useGetProductsQuery,
  useUpdateProductMutation,
} from "@/redux/api/productsApi";
import React, { useEffect, useState } from "react";
import { toast } from "sonner";

export default function ProductsPage() {
  const { user } = useAuth();

  // States for search, pagination, and filters
  const [searchTerm, setSearchTerm] = useState("");
  const [debouncedSearch, setDebouncedSearch] = useState("");
  const [categoryId, setCategoryId] = useState("");
  const [page, setPage] = useState(1);
  const limit = 6;


  useEffect(() => {
    const timer = setTimeout(() => {
      setDebouncedSearch(searchTerm);
      setPage(1);
    }, 400);
    return () => clearTimeout(timer);
  }, [searchTerm]);

  // Fetching categories and products
  const { data: categoriesResponse } = useGetCategoriesQuery(undefined);
  const categories = categoriesResponse?.data || [];

  const { data: productsResponse, isLoading, isError } = useGetProductsQuery({
    page,
    limit,
    searchTerm: debouncedSearch,
    categoryId: categoryId || undefined,
  });

  const products = productsResponse?.data?.data || [];
  const meta = productsResponse?.data?.meta || { page: 1, limit: 6, total: 0, totalPages: 1 };

  const [createProduct, { isLoading: isCreating }] = useCreateProductMutation();
  const [updateProduct, { isLoading: isUpdating }] = useUpdateProductMutation();
  const [deleteProduct] = useDeleteProductMutation();

  // Role management
  const userRole = user?.role?.toUpperCase();
  const canManage = userRole === "ADMIN" || userRole === "MANAGER";

  // Modals visibility
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [selectedProduct, setSelectedProduct] = useState<any>(null);
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [deleteId, setDeleteId] = useState<string | null>(null);

  // Form states
  const [formData, setFormData] = useState({
    name: "",
    categoryId: "",
    purchasePrice: "",
    sellingPrice: "",
    stockQuantity: "",
  });
  const [selectedImage, setSelectedImage] = useState<File | null>(null);
  const [imagePreview, setImagePreview] = useState<string | null>(null);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      const file = e.target.files[0];
      setSelectedImage(file);
      setImagePreview(URL.createObjectURL(file));
    }
  };

  const handleAddProductSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedImage) {
      toast.error("Product image is required!");
      return;
    }

    const payload = new FormData();
    payload.append("name", formData.name);
    payload.append("categoryId", formData.categoryId);
    payload.append("purchasePrice", formData.purchasePrice);
    payload.append("sellingPrice", formData.sellingPrice);
    payload.append("stockQuantity", formData.stockQuantity);
    payload.append("image", selectedImage);

    try {
      const result = await createProduct(payload).unwrap();
      if (result.success) {
        toast.success("Product created successfully!");
        setIsAddModalOpen(false);
        resetForm();
      } else {
        toast.error(result.message || "Failed to create product");
      }
    } catch (err: any) {
      toast.error(err?.data?.message || "An error occurred");
    }
  };

  const handleEditProductClick = (product: any) => {
    setSelectedProduct(product);
    setFormData({
      name: product.name,
      categoryId: product.categoryId || "",
      purchasePrice: product.purchasePrice.toString(),
      sellingPrice: product.sellingPrice.toString(),
      stockQuantity: product.stockQuantity.toString(),
    });
    setSelectedImage(null);
    setImagePreview(product.image || null);
    setIsEditModalOpen(true);
  };

  const handleEditProductSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedProduct) return;

    const payload = new FormData();
    payload.append("name", formData.name);
    payload.append("categoryId", formData.categoryId);
    payload.append("purchasePrice", formData.purchasePrice);
    payload.append("sellingPrice", formData.sellingPrice);
    payload.append("stockQuantity", formData.stockQuantity);
    if (selectedImage) {
      payload.append("image", selectedImage);
    }

    try {
      const result = await updateProduct({ id: selectedProduct.id, formData: payload }).unwrap();
      if (result.success) {
        toast.success("Product updated successfully!");
        setIsEditModalOpen(false);
        resetForm();
      } else {
        toast.error(result.message || "Failed to update product");
      }
    } catch (err: any) {
      toast.error(err?.data?.message || "An error occurred");
    }
  };

  const proceedDelete = async (id: string) => {
    try {
      const result = await deleteProduct(id).unwrap();
      if (result.success) {
        toast.success("Product deleted successfully!");
      } else {
        toast.error(result.message || "Failed to delete product");
      }
    } catch (err: any) {
      toast.error(err?.data?.message || "An error occurred");
    }
  };

  const handleDeleteClick = (id: string) => {
    setDeleteId(id);
    setIsDeleteModalOpen(true);
  };

  const resetForm = () => {
    setFormData({
      name: "",
      categoryId: "",
      purchasePrice: "",
      sellingPrice: "",
      stockQuantity: "",
    });
    setSelectedImage(null);
    setImagePreview(null);
    setSelectedProduct(null);
  };

  return (
    <div className="flex flex-col gap-8">
      {/* Page Header */}
      <section className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 rounded-2xl bg-gradient-to-br from-primary/10 via-primary/5 to-background p-8 shadow-sm border border-primary/10">
        <div className="flex flex-col gap-2">
          <h2 className="text-3xl font-bold tracking-tight">Product Inventory</h2>
          <p className="text-lg text-muted-foreground">
            Manage your inventory list, prices, stock quantities, and product items.
          </p>
        </div>
        {canManage && (
          <button
            onClick={() => {
              resetForm();
              setIsAddModalOpen(true);
            }}
            className="w-full md:w-auto inline-flex items-center justify-center gap-2 rounded-xl bg-primary text-primary-foreground hover:bg-primary/90 px-5 py-3 text-sm font-semibold shadow-md transition-all duration-200 hover:translate-y-[-1px]"
          >
            <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><line x1="12" y1="5" x2="12" y2="19"/><line x1="5" y1="12" x2="19" y2="12"/></svg>
            Add Product
          </button>
        )}
      </section>

      {/* Filter and Search Bar */}
      <section className="flex flex-col sm:flex-row gap-4 bg-card border rounded-xl p-4 shadow-sm items-center">
        <div className="relative flex-1 w-full">
          <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground"><circle cx="11" cy="11" r="8"/><path d="m21 21-4.3-4.3"/></svg>
          <input
            type="text"
            placeholder="Search by product name or SKU..."
            className="flex h-10 w-full rounded-md border border-input bg-background pl-10 pr-3 py-2 text-sm focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring transition-all"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>
        <div className="w-full sm:w-48">
          <CustomSelect
            options={[
              { value: "", label: "All Categories" },
              ...categories.map((cat: any) => ({ value: cat.id, label: cat.name })),
            ]}
            value={categoryId}
            onChange={(selectedId) => {
              setCategoryId(selectedId);
              setPage(1);
            }}
            placeholder="All Categories"
            triggerClassName="rounded-md"
          />
        </div>
      </section>

      {/* Product List Table Component */}
      <ProductTable
        products={products}
        isLoading={isLoading}
        isError={isError}
        canManage={canManage}
        onEdit={handleEditProductClick}
        onDelete={handleDeleteClick}
        page={page}
        totalPages={meta.totalPages}
        totalItems={meta.total}
        onPageChange={setPage}
      />

      {/* Add Product Modal */}
      <ProductModal
        isOpen={isAddModalOpen}
        onClose={() => setIsAddModalOpen(false)}
        onSubmit={handleAddProductSubmit}
        title="Add New Product"
        isSubmitting={isCreating}
        formData={formData}
        handleInputChange={handleInputChange}
        handleImageChange={handleImageChange}
        categories={categories}
        mode="add"
        imagePreview={imagePreview}
      />

      {/* Edit Product Modal */}
      <ProductModal
        isOpen={isEditModalOpen}
        onClose={() => setIsEditModalOpen(false)}
        onSubmit={handleEditProductSubmit}
        title="Edit Product"
        isSubmitting={isUpdating}
        formData={formData}
        handleInputChange={handleInputChange}
        handleImageChange={handleImageChange}
        categories={categories}
        mode="edit"
        imagePreview={imagePreview}
      />

      {/* Delete Confirmation Modal */}
      <ConfirmModal
        isOpen={isDeleteModalOpen}
        onClose={() => {
          setIsDeleteModalOpen(false);
          setDeleteId(null);
        }}
        onConfirm={() => {
          if (deleteId) proceedDelete(deleteId);
        }}
        title="Delete Product"
        message="Are you sure you want to delete this product? This action cannot be undone."
        confirmLabel="Delete"
        isDanger={true}
      />
    </div>
  );
}
