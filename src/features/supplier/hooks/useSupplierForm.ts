import { zodResolver } from "@hookform/resolvers/zod";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { useState } from "react";
import { useForm } from "react-hook-form";
import { z } from "zod";

import { createSupplier, updateSupplier } from "../api/supplierApi";
import { Supplier } from "../types";

import { useToast } from "@/hooks/use-toast";

// Schema cho form thêm/sửa nhà cung cấp
const supplierSchema = z.object({
  name: z.string().min(2, { message: "Tên nhà cung cấp phải có ít nhất 2 ký tự" }),
  description: z.string().min(10, { message: "Mô tả phải có ít nhất 10 ký tự" }),
});

export type SupplierFormValues = z.infer<typeof supplierSchema>;

interface UseSupplierFormProps {
  supplier?: Supplier | null;
  onSuccess?: () => void;
}

export const useSupplierForm = ({ supplier, onSuccess }: UseSupplierFormProps = {}) => {
  const [imageFile, setImageFile] = useState<File | null>(null);
  const [imagePreview, setImagePreview] = useState<string | null>(supplier?.image || null);
  const { toast } = useToast();
  const queryClient = useQueryClient();

  // Form với validation
  const {
    register,
    handleSubmit,
    reset,
    formState: { errors, isDirty },
  } = useForm<SupplierFormValues>({
    resolver: zodResolver(supplierSchema),
    defaultValues: {
      name: supplier?.name || "",
      description: supplier?.description || "",
    },
  });

  // Mutation để tạo mới nhà cung cấp
  const createMutation = useMutation({
    mutationFn: (data: SupplierFormValues) => {
      const payload = {
        ...data,
        // Chỉ đưa image vào khi có file
        ...(imageFile ? { image: imageFile } : {})
      };
      return createSupplier(payload);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["suppliers"] });
      toast({
        title: "Thành công",
        description: "Thêm nhà cung cấp mới thành công",
      });
      reset();
      setImageFile(null);
      setImagePreview(null);
      onSuccess?.();
    },
    onError: (error) => {
      console.error("Failed to create supplier:", error);
      toast({
        title: "Lỗi",
        description: "Không thể thêm nhà cung cấp mới",
        variant: "destructive",
      });
    },
  });

  // Mutation để cập nhật nhà cung cấp
  const updateMutation = useMutation({
    mutationFn: (data: SupplierFormValues) => {
      if (!supplier) throw new Error("Supplier is required for updating");
      const payload = {
        ...data,
        // Chỉ đưa image vào khi có file
        ...(imageFile ? { image: imageFile } : {})
      };
      return updateSupplier(supplier.id, payload);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["suppliers"] });
      toast({
        title: "Thành công",
        description: "Cập nhật nhà cung cấp thành công",
      });
      onSuccess?.();
    },
    onError: (error) => {
      console.error("Failed to update supplier:", error);
      toast({
        title: "Lỗi",
        description: "Không thể cập nhật nhà cung cấp",
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
  const onSubmit = (data: SupplierFormValues) => {
    if (supplier) {
      updateMutation.mutate(data);
    } else {
      createMutation.mutate(data);
    }
  };

  // Reset form về trạng thái ban đầu
  const resetForm = () => {
    reset({
      name: supplier?.name || "",
      description: supplier?.description || "",
    });
    if (supplier?.image) {
      setImagePreview(supplier.image);
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