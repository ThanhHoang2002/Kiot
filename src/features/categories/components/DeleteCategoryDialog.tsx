import { Loader2 } from "lucide-react";

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
import { useDeleteCategory } from "../hooks/useDeleteCategory";

interface DeleteCategoryDialogProps {
  isOpen: boolean;
  categoryId?: number;
  categoryName?: string;
  onOpenChange: (open: boolean) => void;
  onSuccess?: () => void;
}

export const DeleteCategoryDialog = ({
  isOpen,
  categoryId,
  categoryName = "danh mục này",
  onOpenChange,
  onSuccess,
}: DeleteCategoryDialogProps) => {
  const { deleteCategory, isDeleting } = useDeleteCategory({
    onSuccess: () => {
      onSuccess?.();
      onOpenChange(false);
    },
  });

  const handleDelete = () => {
    if (categoryId) {
      deleteCategory(categoryId);
    }
  };

  return (
    <AlertDialog open={isOpen} onOpenChange={onOpenChange}>
      <AlertDialogContent>
        <AlertDialogHeader>
          <AlertDialogTitle>Xác nhận xóa danh mục</AlertDialogTitle>
          <AlertDialogDescription>
            Bạn có chắc chắn muốn xóa <strong>{categoryName}</strong>? Hành động này không
            thể hoàn tác và có thể ảnh hưởng đến các sản phẩm liên quan.
          </AlertDialogDescription>
        </AlertDialogHeader>
        <AlertDialogFooter>
          <AlertDialogCancel disabled={isDeleting}>Hủy</AlertDialogCancel>
          <AlertDialogAction
            onClick={handleDelete}
            disabled={isDeleting || !categoryId}
            className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
          >
            {isDeleting && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
            {isDeleting ? "Đang xóa..." : "Xóa danh mục"}
          </AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
}; 