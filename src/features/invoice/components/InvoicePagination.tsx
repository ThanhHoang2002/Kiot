import React, { memo, useCallback, useMemo } from 'react';

import {
  Pagination,
  PaginationContent,
  PaginationEllipsis,
  PaginationItem,
  PaginationLink,
  PaginationNext,
  PaginationPrevious,
} from '@/components/ui/pagination';

interface PaginationProps {
  currentPage: number;
  totalPages: number;
  onPageChange: (page: number) => void;
}

const InvoicePagination = ({ currentPage, totalPages, onPageChange }: PaginationProps) => {
  if (totalPages <= 1) return null;

  // Tối ưu tạo page numbers
  const pageNumbers = useMemo(() => {
    const result: (number | 'ellipsis')[] = [];
    
    if (currentPage > 3) {
      result.push(1);
      result.push('ellipsis');
    }
    
    // Pages around current page
    for (let i = Math.max(1, currentPage - 1); i <= Math.min(totalPages, currentPage + 1); i++) {
      result.push(i);
    }
    
    if (currentPage < totalPages - 2) {
      result.push('ellipsis');
      result.push(totalPages);
    }

    return result;
  }, [currentPage, totalPages]);

  // Callbacks cho navigate
  const handlePrevious = useCallback((e: React.MouseEvent<HTMLAnchorElement>) => {
    e.preventDefault();
    if (currentPage > 1) {
      onPageChange(currentPage - 1);
    }
  }, [currentPage, onPageChange]);

  const handleNext = useCallback((e: React.MouseEvent<HTMLAnchorElement>) => {
    e.preventDefault();
    if (currentPage < totalPages) {
      onPageChange(currentPage + 1);
    }
  }, [currentPage, totalPages, onPageChange]);

  const handlePageClick = useCallback((e: React.MouseEvent<HTMLAnchorElement>, page: number) => {
    e.preventDefault();
    onPageChange(page);
  }, [onPageChange]);

  const renderPageNumbers = useCallback(() => {
    return pageNumbers.map((page, index) => {
      if (page === 'ellipsis') {
        return (
          <PaginationItem key={`ellipsis-${index}`}>
            <PaginationEllipsis />
          </PaginationItem>
        );
      }
      
      return (
        <PaginationItem key={page}>
          <PaginationLink
            isActive={page === currentPage}
            onClick={(e) => handlePageClick(e, page)}
            href="#"
          >
            {page}
          </PaginationLink>
        </PaginationItem>
      );
    });
  }, [pageNumbers, currentPage, handlePageClick]);

  const isPreviousDisabled = currentPage === 1;
  const isNextDisabled = currentPage === totalPages;

  return (
    <Pagination className="mt-4">
      <PaginationContent>
        <PaginationItem>
          <PaginationPrevious
            href="#"
            onClick={handlePrevious}
            className={isPreviousDisabled ? 'pointer-events-none opacity-50' : ''}
          />
        </PaginationItem>
        
        {renderPageNumbers()}
        
        <PaginationItem>
          <PaginationNext
            href="#"
            onClick={handleNext}
            className={isNextDisabled ? 'pointer-events-none opacity-50' : ''}
          />
        </PaginationItem>
      </PaginationContent>
    </Pagination>
  );
};

export default memo(InvoicePagination); 