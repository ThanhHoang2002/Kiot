import { useMutation, useQueryClient } from "@tanstack/react-query";
import { AxiosError } from "axios";

import { deleteCategory } from "../api/categoryApi";

import { useToast } from "@/hooks/use-toast";

interface UseDeleteCategoryProps {
  onSuccess?: () => void;
}

interface ApiErrorResponse {
  message: string;
  status: number;
}

export const useDeleteCategory = ({ onSuccess }: UseDeleteCategoryProps = {}) => {
  const { toast } = useToast();
  const queryClient = useQueryClient();

  const mutation = useMutation({
    mutationFn: (id: number) => deleteCategory(id),
    onSuccess: (_, categoryId) => {
      queryClient.invalidateQueries({ 
        queryKey: ["categories"] 
      });
      
      queryClient.removeQueries({ 
        queryKey: ["category", categoryId.toString()]
      });
      
      toast({
        title: "Thành công",
        description: "Xóa danh mục thành công",
      });
      onSuccess?.();
    },
    onError: (error: AxiosError<ApiErrorResponse>) => {
      const errorMessage = error.response?.data?.message || "Không thể xóa danh mục. Danh mục có thể đang được sử dụng.";
      console.error("Failed to delete category:", error);
      toast({
        title: "Lỗi",
        description: errorMessage,
        variant: "destructive",
      });
    },
  });

  return {
    deleteCategory: mutation.mutate,
    isDeleting: mutation.isPending,
  };
}; 