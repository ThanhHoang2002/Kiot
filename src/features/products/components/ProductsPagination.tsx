import { ChevronLeft, ChevronRight, ChevronsLeft, ChevronsRight } from 'lucide-react';

interface ProductsPaginationProps {
  currentPage: number;
  totalPages: number;
  onPageChange: (page: number) => void;
  totalItems: number;
  itemsPerPage: number;
}

export const ProductsPagination = ({
  currentPage,
  totalPages,
  onPageChange,
  totalItems,
  itemsPerPage,
}: ProductsPaginationProps) => {
  const pages = Array.from({ length: totalPages }, (_, i) => i + 1);
  const maxVisiblePages = 5;

  const getVisiblePages = () => {
    if (totalPages <= maxVisiblePages) return pages;

    const start = Math.max(
      Math.min(
        currentPage - Math.floor(maxVisiblePages / 2),
        totalPages - maxVisiblePages + 1
      ),
      1
    );
    const end = Math.min(start + maxVisiblePages - 1, totalPages);

    return pages.slice(start - 1, end);
  };

  const visiblePages = getVisiblePages();
  const startItem = (currentPage - 1) * itemsPerPage + 1;
  const endItem = Math.min(currentPage * itemsPerPage, totalItems);

  return (
    <div className="flex items-center gap-8 pl-1">
      <div className="flex items-center justify-center gap-1">
        <button
          onClick={() => onPageChange(1)}
          className={`flex h-6 w-6 items-center justify-center rounded ${
            currentPage === 1
              ? 'cursor-not-allowed text-gray-400'
              : 'hover:bg-gray-100'
          }`}
          title="Trang đầu"
        >
          <ChevronsLeft className="h-4 w-4" />
        </button>

        <button
          onClick={() => currentPage > 1 && onPageChange(currentPage - 1)}
          className={`flex h-6 w-6 items-center justify-center rounded ${
            currentPage === 1
              ? 'cursor-not-allowed text-gray-400'
              : 'hover:bg-gray-100'
          }`}
          title="Trang trước"
        >
          <ChevronLeft className="h-4 w-4" />
        </button>

        {visiblePages[0] > 1 && (
          <>
            <button
              onClick={() => onPageChange(1)}
              className="flex h-6 w-6 items-center justify-center rounded hover:bg-gray-100"
            >
              1
            </button>
            {visiblePages[0] > 2 && (
              <span className="flex h-6 w-6 items-center justify-center">...</span>
            )}
          </>
        )}

        {visiblePages.map((page) => (
          <button
            key={page}
            onClick={() => onPageChange(page)}
            className={`flex h-6 w-6 items-center justify-center rounded ${
              currentPage === page
                ? 'bg-green-600 text-white'
                : 'hover:bg-gray-100'
            }`}
          >
            {page}
          </button>
        ))}

        {visiblePages[visiblePages.length - 1] < totalPages && (
          <>
            {visiblePages[visiblePages.length - 1] < totalPages - 1 && (
              <span className="flex h-6 w-6 items-center justify-center">...</span>
            )}
            <button
              onClick={() => onPageChange(totalPages)}
              className="flex h-6 w-6 items-center justify-center rounded hover:bg-gray-100"
            >
              {totalPages}
            </button>
          </>
        )}

        <button
          onClick={() => currentPage < totalPages && onPageChange(currentPage + 1)}
          className={`flex h-6 w-6 items-center justify-center rounded ${
            currentPage === totalPages
              ? 'cursor-not-allowed text-gray-400'
              : 'hover:bg-gray-100'
          }`}
          title="Trang sau"
        >
          <ChevronRight className="h-4 w-4" />
        </button>

        <button
          onClick={() => onPageChange(totalPages)}
          className={`flex h-6 w-6 items-center justify-center rounded ${
            currentPage === totalPages
              ? 'cursor-not-allowed text-gray-400'
              : 'hover:bg-gray-100'
          }`}
          title="Trang cuối"
        >
          <ChevronsRight className="h-4 w-4" />
        </button>
      </div>
      <div className="text-sm font-medium">
        Hiển thị {startItem}-{endItem} / Tổng số {totalItems} sản phẩm
      </div>
    </div>
  );
}; 