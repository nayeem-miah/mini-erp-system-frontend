/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";

import { useAuth } from "@/context/AuthContext";
import {
  useCreateCategoryMutation,
  useDeleteCategoryMutation,
  useGetCategoriesQuery,
  useUpdateCategoryMutation,
} from "@/redux/api/categoriesApi";
import React, { useState } from "react";
import { toast } from "sonner";
import Loader from "@/components/ui/Loader";
import ConfirmModal from "@/components/ui/ConfirmModal";
import ErrorBanner from "@/components/ui/ErrorBanner";

export default function CategoriesPage() {
  const { user } = useAuth();
  const { data: response, isLoading, isError } = useGetCategoriesQuery(undefined);
  const [createCategory, { isLoading: isCreating }] = useCreateCategoryMutation();
  const [updateCategory, { isLoading: isUpdating }] = useUpdateCategoryMutation();
  const [deleteCategory] = useDeleteCategoryMutation();

  const [categoryName, setCategoryName] = useState("");
  const [editingId, setEditingId] = useState<string | null>(null);
  const [editingName, setEditingName] = useState("");
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [deleteId, setDeleteId] = useState<string | null>(null);

  const categories = response?.data || [];


  const userRole = user?.role?.toUpperCase();
  const canManage = userRole === "ADMIN" || userRole === "MANAGER";

  const handleCreate = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!categoryName.trim()) return;

    try {
      const result = await createCategory({ name: categoryName.trim() }).unwrap();
      if (result.success) {
        toast.success("Category created successfully!");
        setCategoryName("");
      } else {
        toast.error(result.message || "Failed to create category");
      }
    } catch (err: any) {
      toast.error(err?.data?.message || "An error occurred");
    }
  };

  const handleUpdate = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!editingId || !editingName.trim()) return;

    try {
      const result = await updateCategory({ id: editingId, name: editingName.trim() }).unwrap();
      if (result.success) {
        toast.success("Category updated successfully!");
        setEditingId(null);
        setEditingName("");
      } else {
        toast.error(result.message || "Failed to update category");
      }
    } catch (err: any) {
      toast.error(err?.data?.message || "An error occurred");
    }
  };

  const proceedDelete = async (id: string) => {
    try {
      const result = await deleteCategory(id).unwrap();
      if (result.success) {
        toast.success("Category deleted successfully!");
      } else {
        toast.error(result.message || "Failed to delete category");
      }
    } catch (err: any) {
      toast.error(err?.data?.message || "An error occurred");
    }
  };

  const handleDelete = (id: string) => {
    setDeleteId(id);
    setIsDeleteModalOpen(true);
  };

  if (isLoading) {
    return <Loader />;
  }

  return (
    <div className="flex flex-col gap-8">
      {isError && (
        <ErrorBanner message="Failed to load categories. Please check your backend connection." />
      )}
      {/* Page Header */}
      <section className="flex flex-col gap-2 rounded-2xl bg-gradient-to-br from-primary/10 via-primary/5 to-background p-8 shadow-sm border border-primary/10">
        <h2 className="text-3xl font-bold tracking-tight">Category Management</h2>
        <p className="text-lg text-muted-foreground">
          View, create, and manage product categories for your inventory system.
        </p>
      </section>

      <div className="grid gap-8 lg:grid-cols-3">
        {/* Create / Edit Category Section */}
        {canManage && (
          <div className="flex flex-col gap-6 rounded-xl border bg-card p-6 shadow-sm h-fit">
            <h3 className="text-lg font-semibold">
              {editingId ? "Edit Category" : "Add New Category"}
            </h3>

            {editingId ? (
              <form onSubmit={handleUpdate} className="flex flex-col gap-4">
                <div className="flex flex-col gap-2">
                  <label htmlFor="edit-name" className="text-sm font-medium">Category Name</label>
                  <input
                    id="edit-name"
                    type="text"
                    className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring transition-all"
                    value={editingName}
                    onChange={(e) => setEditingName(e.target.value)}
                    required
                  />
                </div>
                <div className="flex gap-2">
                  <button
                    type="submit"
                    disabled={isUpdating}
                    className="flex-1 inline-flex items-center justify-center rounded-md bg-primary text-primary-foreground hover:bg-primary/90 text-sm font-semibold h-10 transition-colors"
                  >
                    {isUpdating ? "Updating..." : "Save"}
                  </button>
                  <button
                    type="button"
                    onClick={() => {
                      setEditingId(null);
                      setEditingName("");
                    }}
                    className="flex-1 inline-flex items-center justify-center rounded-md border border-input bg-background hover:bg-accent text-sm font-semibold h-10 transition-colors"
                  >
                    Cancel
                  </button>
                </div>
              </form>
            ) : (
              <form onSubmit={handleCreate} className="flex flex-col gap-4">
                <div className="flex flex-col gap-2">
                  <label htmlFor="cat-name" className="text-sm font-medium">Category Name</label>
                  <input
                    id="cat-name"
                    type="text"
                    placeholder="e.g., Electronics"
                    className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring transition-all"
                    value={categoryName}
                    onChange={(e) => setCategoryName(e.target.value)}
                    required
                  />
                </div>
                <button
                  type="submit"
                  disabled={isCreating}
                  className="inline-flex items-center justify-center rounded-md bg-primary text-primary-foreground hover:bg-primary/90 text-sm font-semibold h-10 transition-colors"
                >
                  {isCreating ? "Adding..." : "Add Category"}
                </button>
              </form>
            )}
          </div>
        )}

        {/* Categories List Table */}
        <div className={`rounded-xl border bg-card shadow-sm overflow-hidden ${canManage ? "lg:col-span-2" : "lg:col-span-3"}`}>
          <div className="border-b p-6">
            <h3 className="text-lg font-semibold">All Categories</h3>
            <p className="text-sm text-muted-foreground">List of current system categories.</p>
          </div>

          {isError || categories.length === 0 ? (
            <div className="flex min-h-[200px] flex-col items-center justify-center p-8 text-muted-foreground text-center">
              <svg xmlns="http://www.w3.org/2000/svg" width="36" height="36" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" className="mb-2 opacity-50"><rect width="8" height="4" x="8" y="2" rx="1" ry="1"/><path d="M16 4h2a2 2 0 0 1 2 2v14a2 2 0 0 1-2 2H6a2 2 0 0 1-2-2V6a2 2 0 0 1 2-2h2"/></svg>
              <p className="font-medium">No categories found</p>
              <p className="text-sm opacity-70">Add a new category to get started.</p>
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full border-collapse text-left text-sm text-muted-foreground">
                <thead className="bg-muted/50 text-xs font-semibold uppercase text-foreground">
                  <tr>
                    <th className="px-6 py-4">Name</th>
                    <th className="px-6 py-4">Created Date</th>
                    {canManage && <th className="px-6 py-4 text-right">Actions</th>}
                  </tr>
                </thead>
                <tbody className="divide-y divide-border/50">
                  {categories.map((cat: any) => (
                    <tr key={cat.id} className="transition-colors hover:bg-muted/30">
                      <td className="px-6 py-4 font-semibold text-foreground">{cat.name}</td>
                      <td className="px-6 py-4">
                        {new Date(cat.createdAt).toLocaleDateString("en-US", {
                          year: "numeric",
                          month: "short",
                          day: "numeric",
                        })}
                      </td>
                      {canManage && (
                        <td className="px-6 py-4 text-right">
                          <div className="flex justify-end gap-2">
                            <button
                              onClick={() => {
                                setEditingId(cat.id);
                                setEditingName(cat.name);
                              }}
                              className="inline-flex h-8 items-center justify-center rounded-md border border-input bg-background px-3 text-xs font-medium hover:bg-accent hover:text-accent-foreground transition-all"
                            >
                              Edit
                            </button>
                            <button
                              onClick={() => handleDelete(cat.id)}
                              className="inline-flex h-8 items-center justify-center rounded-md bg-destructive/10 px-3 text-xs font-medium text-destructive hover:bg-destructive hover:text-destructive-foreground transition-all"
                            >
                              Delete
                            </button>
                          </div>
                        </td>
                      )}
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>
      </div>

      <ConfirmModal
        isOpen={isDeleteModalOpen}
        onClose={() => {
          setIsDeleteModalOpen(false);
          setDeleteId(null);
        }}
        onConfirm={() => {
          if (deleteId) proceedDelete(deleteId);
        }}
        title="Delete Category"
        message="Are you sure you want to delete this category? This action cannot be undone."
        confirmLabel="Delete"
        isDanger={true}
      />
    </div>
  );
}
