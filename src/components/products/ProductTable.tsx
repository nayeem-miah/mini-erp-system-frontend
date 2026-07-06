/* eslint-disable @typescript-eslint/no-explicit-any */
import Loader from "@/components/ui/Loader";
import { ProductTableProps } from "@/types";

export default function ProductTable({
  products,
  isLoading,
  isError,
  canManage,
  onEdit,
  onDelete,
  page,
  totalPages,
  totalItems,
  onPageChange,
}: ProductTableProps) {
  if (isLoading) {
    return <Loader minHeight="min-h-[300px]" />;
  }

  if (isError || products.length === 0) {
    return (
      <div className="flex min-h-[300px] flex-col items-center justify-center p-8 text-muted-foreground text-center">
        <svg
          xmlns="http://www.w3.org/2000/svg"
          width="48"
          height="48"
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth="1.5"
          strokeLinecap="round"
          strokeLinejoin="round"
          className="mb-4 opacity-30"
        >
          <rect width="20" height="14" x="2" y="3" rx="2" />
          <line x1="8" y1="21" x2="16" y2="21" />
          <line x1="12" y1="17" x2="12" y2="21" />
        </svg>
        <p className="font-semibold text-lg">No products found</p>
        <p className="text-sm opacity-70">Add a product or try a different filter.</p>
      </div>
    );
  }

  return (
    <div className="rounded-xl border bg-card shadow-sm overflow-hidden">
      <div className="overflow-x-auto">
        <table className="w-full border-collapse text-left text-sm text-muted-foreground">
          <thead className="bg-muted/50 text-xs font-semibold uppercase text-foreground border-b border-border/50">
            <tr>
              <th className="px-6 py-4">Image</th>
              <th className="px-6 py-4">SKU</th>
              <th className="px-6 py-4">Name</th>
              <th className="px-6 py-4">Category</th>
              <th className="px-6 py-4">Purchase Price</th>
              <th className="px-6 py-4">Selling Price</th>
              <th className="px-6 py-4">Stock</th>
              {canManage && <th className="px-6 py-4 text-right">Actions</th>}
            </tr>
          </thead>
          <tbody className="divide-y divide-border/50">
            {products.map((product: any) => {
              const isLowStock = product.stockQuantity < 5;
              return (
                <tr key={product.id} className="transition-colors hover:bg-muted/30">
                  <td className="px-6 py-4">
                    <div className="h-10 w-10 overflow-hidden rounded-lg border bg-muted flex items-center justify-center shadow-sm">
                      {product.image ? (
                        // eslint-disable-next-line @next/next/no-img-element
                        <img
                          src={product.image}
                          alt={product.name}
                          className="h-full w-full object-cover"
                        />
                      ) : (
                        <svg
                          xmlns="http://www.w3.org/2000/svg"
                          width="16"
                          height="16"
                          viewBox="0 0 24 24"
                          fill="none"
                          stroke="currentColor"
                          strokeWidth="2"
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          className="opacity-40"
                        >
                          <rect width="18" height="18" x="3" y="3" rx="2" ry="2" />
                          <circle cx="9" cy="9" r="2" />
                          <path d="m21 15-3.086-3.086a2 2 0 0 0-2.828 0L6 21" />
                        </svg>
                      )}
                    </div>
                  </td>
                  <td className="px-6 py-4 font-mono text-xs text-muted-foreground">{product.sku}</td>
                  <td className="px-6 py-4 font-semibold text-foreground">{product.name}</td>
                  <td className="px-6 py-4">
                    <span className="inline-flex items-center rounded-md bg-secondary px-2.5 py-0.5 text-xs font-medium text-secondary-foreground ring-1 ring-inset ring-secondary-foreground/10">
                      {product.category?.name || "N/A"}
                    </span>
                  </td>
                  <td className="px-6 py-4">${product.purchasePrice.toFixed(2)}</td>
                  <td className="px-6 py-4 font-semibold text-foreground">${product.sellingPrice.toFixed(2)}</td>
                  <td className="px-6 py-4">
                    <span
                      className={`inline-flex items-center rounded-md px-2.5 py-0.5 text-xs font-semibold ring-1 ring-inset ${
                        isLowStock
                          ? "bg-destructive/15 text-destructive ring-destructive/20"
                          : "bg-primary/10 text-primary ring-primary/20"
                      }`}
                    >
                      {product.stockQuantity} {isLowStock && " (Low)"}
                    </span>
                  </td>
                  {canManage && (
                    <td className="px-6 py-4 text-right">
                      <div className="flex justify-end gap-2">
                        <button
                          onClick={() => onEdit(product)}
                          className="inline-flex h-8 items-center justify-center rounded-md border border-input bg-background px-3 text-xs font-medium hover:bg-accent hover:text-accent-foreground transition-all"
                        >
                          Edit
                        </button>
                        <button
                          onClick={() => onDelete(product.id)}
                          className="inline-flex h-8 items-center justify-center rounded-md bg-destructive/10 px-3 text-xs font-medium text-destructive hover:bg-destructive hover:text-destructive-foreground transition-all"
                        >
                          Delete
                        </button>
                      </div>
                    </td>
                  )}
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>

      {/* Pagination Controls */}
      {totalPages > 1 && (
        <div className="flex items-center justify-between border-t px-6 py-4">
          <span className="text-xs text-muted-foreground">
            Page {page} of {totalPages} ({totalItems} total items)
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
  );
}
