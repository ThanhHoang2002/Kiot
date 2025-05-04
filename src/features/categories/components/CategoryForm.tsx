import { ImageIcon, Loader2 } from "lucide-react";

import { Button } from "@/components/ui/button";
import { FormField } from "@/components/ui/form-field";
import Image from "@/components/ui/image";
import { Textarea } from "@/components/ui/textarea";
import { Category } from "../types";
import { CategoryFormValues, useCategoryForm } from "../hooks/useCategoryForm";

interface CategoryFormProps {
  category?: Category | null;
  onSuccess?: () => void;
  onCancel?: () => void;
}

export const CategoryForm = ({ category, onSuccess, onCancel }: CategoryFormProps) => {
  // Sử dụng custom hook quản lý form
  const {
    register,
    handleSubmit,
    errors,
    imagePreview,
    isSubmitting,
    onSubmit,
    handleImageChange,
    resetForm,
  } = useCategoryForm({
    category,
    onSuccess,
  });

  const handleFormSubmit = (data: CategoryFormValues) => {
    onSubmit(data);
  };

  const handleCancel = () => {
    resetForm();
    onCancel?.();
  };

  return (
    <form onSubmit={handleSubmit(handleFormSubmit)} className="space-y-6">
      {/* Hình ảnh */}
      <div className="flex flex-col items-center space-y-4">
        <div className="relative h-48 w-full max-w-md overflow-hidden rounded-lg border-2 border-dashed border-gray-300 bg-gray-50">
          {imagePreview ? (
            <Image
              src={imagePreview}
              containerClassName="h-full w-full"
              fallback={<ImageIcon className="h-12 w-12 text-gray-400" />}
              alt="Preview"
              className="h-full w-full object-contain"
            />
          ) : (
            <div className="flex h-full w-full flex-col items-center justify-center">
              <ImageIcon className="h-12 w-12 text-gray-400" />
              <p className="mt-2 text-sm text-gray-500">Chưa có hình ảnh</p>
            </div>
          )}
        </div>

        <div>
          <label htmlFor="image" className="cursor-pointer">
            <span className="inline-flex items-center justify-center rounded-md bg-primary px-4 py-2 text-sm font-medium text-primary-foreground ring-offset-background transition-colors hover:bg-primary/90 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50">
              {imagePreview ? "Thay đổi hình ảnh" : "Tải lên hình ảnh"}
            </span>
            <input
              type="file"
              id="image"
              accept="image/*"
              className="hidden"
              onChange={handleImageChange}
              disabled={isSubmitting}
            />
          </label>
        </div>
      </div>

      {/* Tên danh mục */}
      <FormField
        id="name"
        label="Tên danh mục"
        placeholder="Nhập tên danh mục"
        error={errors.name}
        disabled={isSubmitting}
        registration={register("name")}
      />

      {/* Mô tả */}
      <div className="space-y-2">
        <label htmlFor="description" className="text-sm font-medium">
          Mô tả
        </label>
        <Textarea
          id="description"
          placeholder="Nhập mô tả chi tiết về danh mục"
          className="min-h-32 resize-none"
          disabled={isSubmitting}
          {...register("description")}
        />
        {errors.description && (
          <p className="text-xs text-red-500">{errors.description.message}</p>
        )}
      </div>

      {/* Buttons */}
      <div className="flex justify-end gap-2">
        <Button
          type="button"
          variant="outline"
          onClick={handleCancel}
          disabled={isSubmitting}
        >
          Hủy
        </Button>
        <Button type="submit" disabled={isSubmitting} className="flex items-center gap-2">
          {isSubmitting && <Loader2 className="h-4 w-4 animate-spin" />}
          {isSubmitting
            ? "Đang xử lý..."
            : category
            ? "Cập nhật danh mục"
            : "Thêm danh mục"}
        </Button>
      </div>
    </form>
  );
}; 