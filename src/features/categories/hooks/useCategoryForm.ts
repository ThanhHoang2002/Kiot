import { zodResolver } from "@hookform/resolvers/zod";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { AxiosError } from "axios";
import { useCallback, useEffect, useState } from "react";
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

interface ApiErrorResponse {
  message: string;
  status: number;
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

  // Update form values when category changes
  useEffect(() => {
    if (category) {
      reset({
        name: category.name || "",
        description: category.description || "",
      });
      setImagePreview(category.image || null);
    }
  }, [category, reset]);

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
      // Specific invalidation instead of invalidating all categories
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
    onError: (error: AxiosError<ApiErrorResponse>) => {
      const errorMessage = error.response?.data?.message || "Không thể thêm danh mục mới";
      console.error("Failed to create category:", error);
      toast({
        title: "Lỗi",
        description: errorMessage,
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
    onSuccess: (data) => {
      // More specific query invalidation
      queryClient.invalidateQueries({ 
        queryKey: ["categories"]
      });
      // Update the specific category in the cache if needed
      if (category) {
        queryClient.setQueryData(
          ["category", category.id.toString()], 
          data
        );
      }
      toast({
        title: "Thành công",
        description: "Cập nhật danh mục thành công",
      });
      onSuccess?.();
    },
    onError: (error: AxiosError<ApiErrorResponse>) => {
      const errorMessage = error.response?.data?.message || "Không thể cập nhật danh mục";
      console.error("Failed to update category:", error);
      toast({
        title: "Lỗi",
        description: errorMessage,
        variant: "destructive",
      });
    },
  });

  // Xử lý khi thay đổi hình ảnh - memoized
  const handleImageChange = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      // Release previous preview URL to avoid memory leaks
      if (imagePreview && !imagePreview.startsWith('http')) {
        URL.revokeObjectURL(imagePreview);
      }
      
      setImageFile(file);
      // Tạo URL preview
      const previewUrl = URL.createObjectURL(file);
      setImagePreview(previewUrl);
    }
  }, [imagePreview]);

  // Xử lý submit form
  const onSubmit = useCallback((data: CategoryFormValues) => {
    if (category) {
      updateMutation.mutate(data);
    } else {
      createMutation.mutate(data);
    }
  }, [category, createMutation, updateMutation]);

  // Reset form về trạng thái ban đầu
  const resetForm = useCallback(() => {
    reset({
      name: category?.name || "",
      description: category?.description || "",
    });
    
    // Release any existing object URL
    if (imagePreview && !imagePreview.startsWith('http')) {
      URL.revokeObjectURL(imagePreview);
    }
    
    if (category?.image) {
      setImagePreview(category.image);
    } else {
      setImagePreview(null);
    }
    setImageFile(null);
  }, [category, imagePreview, reset]);

  // Cleanup object URLs on unmount
  useEffect(() => {
    return () => {
      if (imagePreview && !imagePreview.startsWith('http')) {
        URL.revokeObjectURL(imagePreview);
      }
    };
  }, [imagePreview]);

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