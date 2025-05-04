import { ImageIcon, Loader2 } from "lucide-react";

import { useSupplierForm } from "../hooks/useSupplierForm";
import { Supplier } from "../types";

import { Button } from "@/components/ui/button";
import Image from "@/components/ui/image";
import { Textarea } from "@/components/ui/textarea";

interface SupplierFormProps {
  supplier?: Supplier | null;
  onSuccess?: () => void;
  onCancel?: () => void;
}

export const SupplierForm = ({ supplier, onSuccess, onCancel }: SupplierFormProps) => {
  const {
    register,
    handleSubmit,
    errors,
    isSubmitting,
    imagePreview,
    onSubmit,
    handleImageChange,
  } = useSupplierForm({
    supplier,
    onSuccess,
  });

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
      <div className="space-y-4">
        {/* Tên nhà cung cấp */}
        <div className="space-y-2">
          <label htmlFor="name" className="text-sm font-medium">Tên nhà cung cấp</label>
          <input
            id="name"
            {...register("name")}
            className="w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
            placeholder="Nhập tên nhà cung cấp"
          />
          {errors.name && (
            <p className="text-xs text-destructive">{errors.name.message}</p>
          )}
        </div>

        {/* Mô tả */}
        <div className="space-y-2">
          <label htmlFor="description" className="text-sm font-medium">Mô tả</label>
          <Textarea
            id="description"
            {...register("description")}
            className="min-h-32"
            placeholder="Nhập mô tả cho nhà cung cấp"
          />
          {errors.description && (
            <p className="text-xs text-destructive">{errors.description.message}</p>
          )}
        </div>

        {/* Hình ảnh */}
        <div className="space-y-2">
          <label htmlFor="image" className="text-sm font-medium">Hình ảnh</label>
          <div className="space-y-4">
            {/* Hiển thị hình ảnh trước khi upload */}
            <div className="h-52 w-full overflow-hidden rounded-md border bg-background">
              {imagePreview ? (
                <Image
                  src={imagePreview}
                  alt="Hình ảnh nhà cung cấp"
                  containerClassName="h-full w-full"
                  className="h-full w-full object-contain"
                />
              ) : (
                <div className="flex h-full w-full items-center justify-center bg-muted">
                  <ImageIcon className="h-10 w-10 text-muted-foreground" />
                </div>
              )}
            </div>

            {/* Input chọn file */}
            <input
              id="image"
              type="file"
              onChange={handleImageChange}
              accept="image/*"
              className="w-full cursor-pointer rounded-md border border-input bg-background px-3 py-2 text-sm text-muted-foreground file:mr-4 file:cursor-pointer file:rounded-md file:border-0 file:bg-primary file:px-4 file:py-2 file:text-sm file:font-medium file:text-primary-foreground hover:file:bg-primary/90"
            />
          </div>
        </div>
      </div>

      {/* Nút lưu và hủy */}
      <div className="flex items-center justify-end space-x-4">
        <Button
          type="button"
          variant="outline"
          onClick={onCancel}
          disabled={isSubmitting}
        >
          Hủy
        </Button>
        <Button type="submit" disabled={isSubmitting}>
          {isSubmitting && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
          {supplier ? "Cập nhật" : "Tạo mới"}
        </Button>
      </div>
    </form>
  );
}; 