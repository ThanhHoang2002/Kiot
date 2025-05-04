import { memo } from 'react';

import { Pagination } from '@/components/ui/pagination';

export interface PaginationComponentProps {
  currentPage: number;
  totalItems: number;
  pageSize: number;
  onPageChange: (page: number) => void;
  onPageSizeChange?: (pageSize: number) => void;
  itemName?: string;
}

const PaginationComponent = memo(({ 
  currentPage, 
  totalItems, 
  pageSize, 
  onPageChange,
  onPageSizeChange,
  itemName = 'items'
}: PaginationComponentProps) => {
  // Hiển thị phạm vi mục
  const fromItem = Math.min(totalItems, (currentPage - 1) * pageSize + 1);
  const toItem = Math.min(totalItems, currentPage * pageSize);

  return (
    <div className="flex flex-col items-center space-y-4">
      <div className="text-sm text-muted-foreground">
        Hiển thị {fromItem}-{toItem} trong số {totalItems} {itemName}
      </div>
      
      <Pagination
        page={currentPage}
        total={totalItems}
        pageSize={pageSize}
        onPageChange={onPageChange}
        onPageSizeChange={onPageSizeChange}
        showPageSizeOptions={!!onPageSizeChange}
      />
    </div>
  );
});

PaginationComponent.displayName = 'PaginationComponent';
export default PaginationComponent; 