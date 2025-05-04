import { useMutation, useQueryClient } from "@tanstack/react-query";

import { useToast } from "@/hooks/use-toast";
import { deleteCategory } from "../api/categoryApi";

interface UseDeleteCategoryProps {
  onSuccess?: () => void;
}

export const useDeleteCategory = ({ onSuccess }: UseDeleteCategoryProps = {}) => {
  const { toast } = useToast();
  const queryClient = useQueryClient();

  const mutation = useMutation({
    mutationFn: (id: number) => deleteCategory(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["categories"] });
      toast({
        title: "Thành công",
        description: "Xóa danh mục thành công",
      });
      onSuccess?.();
    },
    onError: (error) => {
      console.error("Failed to delete category:", error);
      toast({
        title: "Lỗi",
        description: "Không thể xóa danh mục. Danh mục có thể đang được sử dụng.",
        variant: "destructive",
      });
    },
  });

  return {
    deleteCategory: mutation.mutate,
    isDeleting: mutation.isPending,
  };
}; 