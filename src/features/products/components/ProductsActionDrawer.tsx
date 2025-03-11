// src/features/products/components/ProductsActionDrawer.tsx
import { Trash2, X } from 'lucide-react';

import { Button } from '@/components/ui/button';

interface ProductsActionDrawerProps {
  selectedCount: number;
  onDelete: () => void;
  onCancel: (checked:boolean) => void;
}

export const ProductsActionDrawer = ({ 
  selectedCount,
  onDelete,
  onCancel 
}: ProductsActionDrawerProps) => {
  if (selectedCount === 0) return null;

  return (
    <div className="fixed bottom-0 left-0 right-0 border-t bg-white shadow-inner animate-in slide-in-from-bottom">
      <div className="container mx-auto flex items-center justify-between px-4 py-4">
        <div className="text-sm text-gray-600">
          Đã chọn {selectedCount} sản phẩm
        </div>
        <div className="flex items-center gap-2">
          <Button
            variant="outline"
            size="sm"
            onClick={()=> onCancel(false)}
            className="gap-2"
          >
            <X className="h-4 w-4" />
            Hủy
          </Button>
          <Button
            variant="destructive"
            size="sm"
            onClick={onDelete}
            className="gap-2"
          >
            <Trash2 className="h-4 w-4" />
            Xóa sản phẩm
          </Button>
        </div>
      </div>
    </div>
  );
};