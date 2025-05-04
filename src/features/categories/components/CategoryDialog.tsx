import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Category } from "../types";
import { CategoryForm } from "./CategoryForm";

interface CategoryDialogProps {
  isOpen: boolean;
  category?: Category | null;
  onOpenChange: (open: boolean) => void;
  onSuccess?: () => void;
}

export const CategoryDialog = ({
  isOpen,
  category,
  onOpenChange,
  onSuccess,
}: CategoryDialogProps) => {
  // Xác định trạng thái là thêm mới hay cập nhật
  const isEditMode = !!category;

  const handleSuccess = () => {
    onSuccess?.();
    onOpenChange(false);
  };

  return (
    <Dialog open={isOpen} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[550px]">
        <DialogHeader>
          <DialogTitle>
            {isEditMode ? "Cập nhật danh mục" : "Thêm danh mục mới"}
          </DialogTitle>
          <DialogDescription>
            {isEditMode
              ? "Chỉnh sửa thông tin danh mục hiện có"
              : "Nhập thông tin để tạo danh mục mới"}
          </DialogDescription>
        </DialogHeader>

        <CategoryForm
          category={category}
          onSuccess={handleSuccess}
          onCancel={() => onOpenChange(false)}
        />
      </DialogContent>
    </Dialog>
  );
}; 