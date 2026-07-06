/* eslint-disable @typescript-eslint/no-explicit-any */
import { ProductModalProps } from "@/types";
import CategorySelect from "./CategorySelect";

export default function ProductModal({
  isOpen,
  onClose,
  onSubmit,
  title,
  isSubmitting,
  formData,
  handleInputChange,
  handleImageChange,
  categories,
  mode,
  imagePreview,
}: ProductModalProps) {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-background/80 backdrop-blur-sm p-4">
      <div className="relative w-full max-w-lg rounded-xl border bg-card p-6 shadow-lg animate-in fade-in zoom-in duration-200">
        <div className="flex items-center justify-between mb-6">
          <h3 className="text-xl font-bold">{title}</h3>
          <button
            onClick={onClose}
            className="rounded-full p-1 hover:bg-accent transition-colors"
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              width="18"
              height="18"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
            >
              <line x1="18" y1="6" x2="6" y2="18" />
              <line x1="6" y1="6" x2="18" y2="18" />
            </svg>
          </button>
        </div>

        <form onSubmit={onSubmit} className="space-y-4">
          <div className="grid grid-cols-2 gap-4">
            <div className="col-span-2 space-y-1.5">
              <label htmlFor="name" className="text-sm font-medium">Product Name</label>
              <input
                type="text"
                id="name"
                name="name"
                className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring transition-all"
                value={formData.name}
                onChange={handleInputChange}
                required
              />
            </div>

            <div className="col-span-2 space-y-1.5">
              <label htmlFor="categoryId" className="text-sm font-medium">Category</label>
              <CategorySelect
                categories={categories}
                value={formData.categoryId}
                onChange={(selectedId) =>
                  handleInputChange({
                    target: { name: "categoryId", value: selectedId },
                  } as any)
                }
              />
            </div>

            <div className="space-y-1.5">
              <label htmlFor="purchasePrice" className="text-sm font-medium">Purchase Price ($)</label>
              <input
                type="number"
                step="0.01"
                id="purchasePrice"
                name="purchasePrice"
                className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring transition-all"
                value={formData.purchasePrice}
                onChange={handleInputChange}
                required
              />
            </div>

            <div className="space-y-1.5">
              <label htmlFor="sellingPrice" className="text-sm font-medium">Selling Price ($)</label>
              <input
                type="number"
                step="0.01"
                id="sellingPrice"
                name="sellingPrice"
                className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring transition-all"
                value={formData.sellingPrice}
                onChange={handleInputChange}
                required
              />
            </div>

            <div className="col-span-2 space-y-1.5">
              <label htmlFor="stockQuantity" className="text-sm font-medium">
                {mode === "add" ? "Initial Stock Quantity" : "Stock Quantity"}
              </label>
              <input
                type="number"
                id="stockQuantity"
                name="stockQuantity"
                className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring transition-all"
                value={formData.stockQuantity}
                onChange={handleInputChange}
                required
              />
            </div>

            <div className="col-span-2 space-y-1.5">
              <label className="text-sm font-medium">
                Product Image{" "}
                {mode === "add" ? (
                  <span className="text-destructive font-bold">*</span>
                ) : (
                  <span className="text-muted-foreground font-normal">(Optional)</span>
                )}
              </label>

              <div className="flex flex-col items-center justify-center w-full">
                <label className="relative flex flex-col items-center justify-center w-full h-40 border-2 border-dashed border-input rounded-xl bg-background hover:bg-accent/40 cursor-pointer overflow-hidden transition-all duration-200">
                  {imagePreview ? (
                    <div className="relative w-full h-full group">
                      {/* eslint-disable-next-line @next/next/no-img-element */}
                      <img src={imagePreview} alt="Preview" className="w-full h-full object-cover" />
                      <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 flex items-center justify-center transition-opacity duration-200 text-white font-medium text-xs">
                        Change Image
                      </div>
                    </div>
                  ) : (
                    <div className="flex flex-col items-center justify-center pt-5 pb-6 text-muted-foreground">
                      <svg xmlns="http://www.w3.org/2000/svg" width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="mb-3 opacity-60"><path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"/><polyline points="17 8 12 3 7 8"/><line x1="12" x2="12" y1="3" y2="15"/></svg>
                      <p className="text-sm font-semibold mb-1">Click to upload or drag & drop</p>
                      <p className="text-xs">PNG, JPG, JPEG or WEBP</p>
                    </div>
                  )}
                  <input
                    type="file"
                    id="image"
                    name="image"
                    accept="image/*"
                    className="hidden"
                    onChange={handleImageChange}
                    required={mode === "add"}
                  />
                </label>
              </div>
            </div>
          </div>

          <div className="flex gap-3 mt-6 border-t pt-4">
            <button
              type="submit"
              disabled={isSubmitting}
              className="flex-1 inline-flex items-center justify-center rounded-md bg-primary text-primary-foreground hover:bg-primary/90 text-sm font-semibold h-10 transition-colors"
            >
              {isSubmitting
                ? mode === "add"
                  ? "Creating..."
                  : "Updating..."
                : mode === "add"
                ? "Save Product"
                : "Update Product"}
            </button>
            <button
              type="button"
              onClick={onClose}
              className="flex-1 inline-flex items-center justify-center rounded-md border border-input bg-background hover:bg-accent text-sm font-semibold h-10 transition-colors"
            >
              Cancel
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
