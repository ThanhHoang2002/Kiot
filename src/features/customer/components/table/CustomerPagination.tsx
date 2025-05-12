import { ChevronLeft, ChevronRight } from 'lucide-react';
import { memo, useMemo } from 'react';

import { Button } from '@/components/ui/button';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';

interface CustomerPaginationProps {
  currentPage: number;
  totalPages: number;
  onPageChange: (page: number) => void;
  itemsPerPage: number;
  totalItems: number;
  onItemsPerPageChange?: (value: number) => void;
}

export const CustomerPagination = memo((props: CustomerPaginationProps) => {
  const {
    currentPage,
    totalPages,
    onPageChange,
    itemsPerPage,
    totalItems,
    onItemsPerPageChange,
  } = props;

  // Tạo mảng chứa các số trang để hiển thị
  const pageNumbers = useMemo(() => {
    const maximumPageToShow = Math.min(5, totalPages);
    const halfOfMaximumPageToShow = Math.floor(maximumPageToShow / 2);
    
    let startPage = Math.max(currentPage - halfOfMaximumPageToShow, 1);
    const endPage = Math.min(startPage + maximumPageToShow - 1, totalPages);

    if (endPage - startPage + 1 < maximumPageToShow) {
      startPage = Math.max(endPage - maximumPageToShow + 1, 1);
    }

    return Array.from({ length: endPage - startPage + 1 }, (_, i) => startPage + i);
  }, [currentPage, totalPages]);

  // Tính toán thông tin hiển thị (ví dụ: Hiển thị 1-10 trong tổng số 100)
  const paginationInfo = useMemo(() => {
    const start = (currentPage - 1) * itemsPerPage + 1;
    const end = Math.min(start + itemsPerPage - 1, totalItems);
    return `Hiển thị ${start}-${end} trong tổng số ${totalItems}`;
  }, [currentPage, itemsPerPage, totalItems]);

  // Xử lý khi thay đổi số lượng item trên 1 trang
  const handleItemsPerPageChange = (value: string) => {
    onItemsPerPageChange?.(Number(value));
  };

  return (
    <div className="flex flex-col gap-2 py-2 md:flex-row md:items-center md:justify-between">
      <p className="text-sm text-muted-foreground">{paginationInfo}</p>
      <div className="flex items-center gap-3">
        {/* Dropdown chọn số lượng items/trang */}
        {onItemsPerPageChange && (
          <div className="flex items-center gap-2">
            <p className="text-sm text-muted-foreground">Số mục:</p>
            <Select
              value={itemsPerPage.toString()}
              onValueChange={handleItemsPerPageChange}
            >
              <SelectTrigger className="h-8 w-16">
                <SelectValue placeholder={itemsPerPage} />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="10">10</SelectItem>
                <SelectItem value="20">20</SelectItem>
                <SelectItem value="50">50</SelectItem>
                <SelectItem value="100">100</SelectItem>
              </SelectContent>
            </Select>
          </div>
        )}

        {/* Nút điều hướng và số trang */}
        <div className="flex items-center gap-1">
          <Button
            variant="outline"
            size="icon"
            onClick={() => onPageChange(currentPage - 1)}
            disabled={currentPage === 1}
            aria-label="Trang trước"
          >
            <ChevronLeft className="h-4 w-4" />
          </Button>

          {/* Hiển thị nút cho trang đầu tiên nếu không nằm trong danh sách */}
          {!pageNumbers.includes(1) && (
            <>
              <Button
                variant={currentPage === 1 ? "default" : "outline"}
                size="icon"
                onClick={() => onPageChange(1)}
                aria-label="Trang 1"
              >
                1
              </Button>
              {pageNumbers[0] > 2 && (
                <Button variant="outline" size="icon" disabled className="cursor-default">
                  ...
                </Button>
              )}
            </>
          )}

          {/* Danh sách các trang */}
          {pageNumbers.map((pageNumber) => (
            <Button
              key={pageNumber}
              variant={currentPage === pageNumber ? "default" : "outline"}
              size="icon"
              onClick={() => onPageChange(pageNumber)}
              aria-label={`Trang ${pageNumber}`}
            >
              {pageNumber}
            </Button>
          ))}

          {/* Hiển thị nút cho trang cuối nếu không nằm trong danh sách */}
          {!pageNumbers.includes(totalPages) && totalPages > 1 && (
            <>
              {pageNumbers[pageNumbers.length - 1] < totalPages - 1 && (
                <Button variant="outline" size="icon" disabled className="cursor-default">
                  ...
                </Button>
              )}
              <Button
                variant={currentPage === totalPages ? "default" : "outline"}
                size="icon"
                onClick={() => onPageChange(totalPages)}
                aria-label={`Trang ${totalPages}`}
              >
                {totalPages}
              </Button>
            </>
          )}

          <Button
            variant="outline"
            size="icon"
            onClick={() => onPageChange(currentPage + 1)}
            disabled={currentPage === totalPages || totalPages === 0}
            aria-label="Trang sau"
          >
            <ChevronRight className="h-4 w-4" />
          </Button>
        </div>
      </div>
    </div>
  );
});

CustomerPagination.displayName = 'CustomerPagination'; 