import { Loader2 } from "lucide-react";
import { useCallback, memo } from "react";

import { useDeleteSupplier } from "../hooks/useDeleteSupplier";

import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";

interface DeleteSupplierDialogProps {
  isOpen: boolean;
  supplierId?: number;
  supplierName?: string;
  onOpenChange: (open: boolean) => void;
  onSuccess?: () => void;
}

const DeleteSupplierDialogComponent = ({
  isOpen,
  supplierId,
  supplierName,
  onOpenChange,
  onSuccess,
}: DeleteSupplierDialogProps) => {
  const { deleteSupplier, isDeleting } = useDeleteSupplier({
    onSuccess: () => {
      onOpenChange(false);
      onSuccess?.();
    },
  });

  const handleDeleteConfirm = useCallback(() => {
    if (!supplierId) return;
    deleteSupplier(supplierId);
  }, [supplierId, deleteSupplier]);

  return (
    <AlertDialog open={isOpen} onOpenChange={onOpenChange}>
      <AlertDialogContent>
        <AlertDialogHeader>
          <AlertDialogTitle>Xác nhận xóa nhà cung cấp</AlertDialogTitle>
          <AlertDialogDescription>
            Bạn có chắc chắn muốn xóa nhà cung cấp {supplierName || "này"} không? Hành động này không
            thể hoàn tác.
          </AlertDialogDescription>
        </AlertDialogHeader>
        <AlertDialogFooter>
          <AlertDialogCancel disabled={isDeleting}>Hủy</AlertDialogCancel>
          <AlertDialogAction
            onClick={handleDeleteConfirm}
            disabled={isDeleting}
            className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
          >
            {isDeleting && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
            Xóa
          </AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
};

// Sử dụng memo để tránh re-render không cần thiết
export const DeleteSupplierDialog = memo(DeleteSupplierDialogComponent); 