import React, { memo, useCallback, useMemo } from 'react';

interface PaginationProps {
  currentPage: number;
  totalPages: number;
  onPageChange: (page: number) => void;
}

const InvoicePagination = ({ currentPage, totalPages, onPageChange }: PaginationProps) => {
  if (totalPages <= 1) return null;

  // Tạo mảng số trang và dấu "..."
  const pageNumbers = useMemo(() => {
    const result: (number | 'ellipsis')[] = [];
    if (currentPage > 3) {
      result.push(1);
      result.push('ellipsis');
    }
    for (let i = Math.max(1, currentPage - 1); i <= Math.min(totalPages, currentPage + 1); i++) {
      result.push(i);
    }
    if (currentPage < totalPages - 2) {
      result.push('ellipsis');
      result.push(totalPages);
    }
    return result;
  }, [currentPage, totalPages]);

  // Xử lý sự kiện
  const handlePrevious = useCallback(() => {
    if (currentPage > 1) {
      onPageChange(currentPage - 1);
    }
  }, [currentPage, onPageChange]);

  const handleNext = useCallback(() => {
    if (currentPage < totalPages) {
      onPageChange(currentPage + 1);
    }
  }, [currentPage, totalPages, onPageChange]);

  const handlePageClick = useCallback((page: number) => {
    if (page !== currentPage) {
      onPageChange(page);
    }
  }, [currentPage, onPageChange]);

  // Hỗ trợ accessibility cho nút
  const handleKeyDown = (action: () => void) => (e: React.KeyboardEvent<HTMLButtonElement>) => {
    if (e.key === 'Enter' || e.key === ' ') {
      e.preventDefault();
      action();
    }
  };

  const isPreviousDisabled = currentPage === 1;
  const isNextDisabled = currentPage === totalPages;

  return (
    <nav
      className="mt-4 flex justify-center gap-x-2"
      role="navigation"
      aria-label="Pagination navigation"
    >
      {/* Previous Button */}
      <button
        type="button"
        onClick={handlePrevious}
        onKeyDown={handleKeyDown(handlePrevious)}
        disabled={isPreviousDisabled}
        aria-label="Previous page"
        tabIndex={0}
        className={
          `px-3 py-1 rounded border border-gray-300 bg-white text-gray-700 hover:bg-gray-100 focus:outline-none focus:ring-2 focus:ring-blue-500 transition ` +
          (isPreviousDisabled ? 'pointer-events-none opacity-50' : 'cursor-pointer')
        }
      >
        &lt;
      </button>

      {/* Page Numbers */}
      {pageNumbers.map((page, idx) => {
        if (page === 'ellipsis') {
          return (
            <span
              key={`ellipsis-${idx}`}
              className="select-none px-2 py-1 text-gray-400"
              aria-hidden="true"
            >
              ...
            </span>
          );
        }
        const isActive = page === currentPage;
        return (
          <button
            key={page}
            type="button"
            onClick={() => handlePageClick(page)}
            onKeyDown={handleKeyDown(() => handlePageClick(page))}
            aria-label={`Go to page ${page}`}
            aria-current={isActive ? 'page' : undefined}
            tabIndex={0}
            className={
              `px-3 py-1 rounded border border-gray-300 transition focus:outline-none focus:ring-2 focus:ring-blue-500 ` +
              (isActive
                ? 'bg-blue-600 text-white font-semibold cursor-default pointer-events-none'
                : 'bg-white text-gray-700 hover:bg-gray-100 cursor-pointer')
            }
            disabled={isActive}
          >
            {page}
          </button>
        );
      })}

      {/* Next Button */}
      <button
        type="button"
        onClick={handleNext}
        onKeyDown={handleKeyDown(handleNext)}
        disabled={isNextDisabled}
        aria-label="Next page"
        tabIndex={0}
        className={
          `px-3 py-1 rounded border border-gray-300 bg-white text-gray-700 hover:bg-gray-100 focus:outline-none focus:ring-2 focus:ring-blue-500 transition ` +
          (isNextDisabled ? 'pointer-events-none opacity-50' : 'cursor-pointer')
        }
      >
        &gt;
      </button>
    </nav>
  );
};

export default memo(InvoicePagination); 