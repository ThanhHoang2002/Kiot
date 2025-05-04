import { useMutation, useQueryClient } from "@tanstack/react-query";

import { useToast } from "@/hooks/use-toast";
import { deleteSupplier } from "../api/supplierApi";

interface UseDeleteSupplierProps {
  onSuccess?: () => void;
}

export const useDeleteSupplier = ({ onSuccess }: UseDeleteSupplierProps = {}) => {
  const { toast } = useToast();
  const queryClient = useQueryClient();

  const mutation = useMutation({
    mutationFn: (id: number) => deleteSupplier(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["suppliers"] });
      toast({
        title: "Thành công",
        description: "Xóa nhà cung cấp thành công",
      });
      onSuccess?.();
    },
    onError: (error) => {
      console.error("Failed to delete supplier:", error);
      toast({
        title: "Lỗi",
        description: "Không thể xóa nhà cung cấp. Nhà cung cấp có thể đang được sử dụng.",
        variant: "destructive",
      });
    },
  });

  return {
    deleteSupplier: mutation.mutate,
    isDeleting: mutation.isPending,
  };
}; 