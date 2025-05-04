import { TruckIcon } from "lucide-react";
import { memo } from "react";

import { Supplier } from "../types";
import { SupplierCard } from "./SupplierCard";

import EmptyState from "@/components/ui/empty-state";
import { LoadingIndicator } from "@/components/ui/loading-indicator";

interface SupplierListProps {
  suppliers: Supplier[];
  isLoading: boolean;
  onEdit: (supplier: Supplier) => void;
  onDelete: (id: number) => void;
}

const SupplierListComponent = ({ suppliers, isLoading, onEdit, onDelete }: SupplierListProps) => {
  if (isLoading) {
    return (
      <div className="flex h-40 items-center justify-center">
        <LoadingIndicator />
      </div>
    );
  }

  if (suppliers.length === 0) {
    return (
      <EmptyState
        icon={<TruckIcon className="h-10 w-10" />}
        title="Không có nhà cung cấp nào"
        description="Chưa có nhà cung cấp nào được tạo. Hãy thêm nhà cung cấp mới."
      />
    );
  }

  return (
    <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
      {suppliers.map((supplier) => (
        <SupplierCard
          key={supplier.id}
          supplier={supplier}
          onEdit={onEdit}
          onDelete={onDelete}
        />
      ))}
    </div>
  );
};

// Sử dụng memo để tránh re-render không cần thiết
export const SupplierList = memo(SupplierListComponent); 