import { zodResolver } from "@hookform/resolvers/zod";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { useState } from "react";
import { useForm } from "react-hook-form";
import { z } from "zod";

import { createCategory, updateCategory } from "../api/categoryApi";
import { Category } from "../types";

import { useToast } from "@/hooks/use-toast";

// Schema cho form thêm/sửa danh mục
const categorySchema = z.object({
  name: z.string().min(2, { message: "Tên danh mục phải có ít nhất 2 ký tự" }),
  description: z.string().min(10, { message: "Mô tả phải có ít nhất 10 ký tự" }),
});

export type CategoryFormValues = z.infer<typeof categorySchema>;

interface UseCategoryFormProps {
  category?: Category | null;
  onSuccess?: () => void;
}

export const useCategoryForm = ({ category, onSuccess }: UseCategoryFormProps = {}) => {
  const [imageFile, setImageFile] = useState<File | null>(null);
  const [imagePreview, setImagePreview] = useState<string | null>(category?.image || null);
  const { toast } = useToast();
  const queryClient = useQueryClient();

  // Form với validation
  const {
    register,
    handleSubmit,
    reset,
    formState: { errors, isDirty },
  } = useForm<CategoryFormValues>({
    resolver: zodResolver(categorySchema),
    defaultValues: {
      name: category?.name || "",
      description: category?.description || "",
    },
  });

  // Mutation để tạo mới danh mục
  const createMutation = useMutation({
    mutationFn: (data: CategoryFormValues) => {
      const payload = {
        ...data,
        // Chỉ đưa image vào khi có file
        ...(imageFile ? { image: imageFile } : {})
      };
      return createCategory(payload);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["categories"] });
      toast({
        title: "Thành công",
        description: "Thêm danh mục mới thành công",
      });
      reset();
      setImageFile(null);
      setImagePreview(null);
      onSuccess?.();
    },
    onError: (error) => {
      console.error("Failed to create category:", error);
      toast({
        title: "Lỗi",
        description: "Không thể thêm danh mục mới",
        variant: "destructive",
      });
    },
  });

  // Mutation để cập nhật danh mục
  const updateMutation = useMutation({
    mutationFn: (data: CategoryFormValues) => {
      if (!category) throw new Error("Category is required for updating");
      const payload = {
        ...data,
        // Chỉ đưa image vào khi có file
        ...(imageFile ? { image: imageFile } : {})
      };
      return updateCategory(category.id, payload);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["categories"] });
      toast({
        title: "Thành công",
        description: "Cập nhật danh mục thành công",
      });
      onSuccess?.();
    },
    onError: (error) => {
      console.error("Failed to update category:", error);
      toast({
        title: "Lỗi",
        description: "Không thể cập nhật danh mục",
        variant: "destructive",
      });
    },
  });

  // Xử lý khi thay đổi hình ảnh
  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setImageFile(file);
      // Tạo URL preview
      const previewUrl = URL.createObjectURL(file);
      setImagePreview(previewUrl);
    }
  };

  // Xử lý submit form
  const onSubmit = (data: CategoryFormValues) => {
    if (category) {
      updateMutation.mutate(data);
    } else {
      createMutation.mutate(data);
    }
  };

  // Reset form về trạng thái ban đầu
  const resetForm = () => {
    reset({
      name: category?.name || "",
      description: category?.description || "",
    });
    if (category?.image) {
      setImagePreview(category.image);
    } else {
      setImagePreview(null);
    }
    setImageFile(null);
  };

  return {
    register,
    handleSubmit,
    errors,
    isDirty,
    imagePreview,
    imageFile,
    isSubmitting: createMutation.isPending || updateMutation.isPending,
    onSubmit,
    handleImageChange,
    resetForm,
  };
}; 