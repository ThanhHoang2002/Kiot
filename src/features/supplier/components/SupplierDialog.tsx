import { useCallback, memo } from 'react';

import { Supplier } from "../types";
import { SupplierForm } from "./SupplierForm";

import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";

interface SupplierDialogProps {
  isOpen: boolean;
  supplier?: Supplier | null;
  onOpenChange: (open: boolean) => void;
  onSuccess?: () => void;
}

const SupplierDialogComponent = ({
  isOpen,
  supplier,
  onOpenChange,
  onSuccess,
}: SupplierDialogProps) => {
  const title = supplier ? "Chỉnh sửa nhà cung cấp" : "Thêm nhà cung cấp mới";

  const handleSuccess = useCallback(() => {
    onOpenChange(false);
    onSuccess?.();
  }, [onOpenChange, onSuccess]);

  const handleCancel = useCallback(() => {
    onOpenChange(false);
  }, [onOpenChange]);

  return (
    <Dialog open={isOpen} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[600px]">
        <DialogHeader>
          <DialogTitle>{title}</DialogTitle>
        </DialogHeader>
        <div className="py-4">
          <SupplierForm
            supplier={supplier}
            onSuccess={handleSuccess}
            onCancel={handleCancel}
          />
        </div>
      </DialogContent>
    </Dialog>
  );
};

export const SupplierDialog = memo(SupplierDialogComponent); 