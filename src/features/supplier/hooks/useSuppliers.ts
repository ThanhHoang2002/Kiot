import { useQuery } from "@tanstack/react-query";
import { useCallback, useState } from "react";

import { getSuppliers } from "../api/supplierApi";
import { SupplierFilterParams } from "../types";

export const useSuppliers = (initialFilters: SupplierFilterParams = {}) => {
  const [filters, setFilters] = useState<SupplierFilterParams>({
    page: 1,
    pageSize: 12,
    sortBy: 'createdAt',
    sortOrder: 'desc',
    ...initialFilters,
  });

  const {
    data,
    isLoading,
    isError,
    error,
    refetch,
  } = useQuery({
    queryKey: ["suppliers", filters],
    queryFn: () => getSuppliers(filters),
  });

  // Tối ưu callback để tránh render lại không cần thiết
  // Thay đổi trang
  const handlePageChange = useCallback((page: number) => {
    setFilters((prev) => ({ ...prev, page }));
  }, []);

  // Thay đổi số lượng item trên một trang
  const handlePageSizeChange = useCallback((pageSize: number) => {
    setFilters((prev) => ({ ...prev, pageSize, page: 1 }));
  }, []);

  // Tìm kiếm
  const handleSearch = useCallback((search: string) => {
    setFilters((prev) => {
      // Nếu search không thay đổi, tránh update state
      if (prev.search === search) return prev;
      return { ...prev, search, page: 1 };
    });
  }, []);

  // Thay đổi sắp xếp
  const handleSortChange = useCallback((sortBy: string, sortOrder: 'asc' | 'desc' = 'asc') => {
    setFilters((prev) => ({ ...prev, sortBy, sortOrder }));
  }, []);

  // Reset bộ lọc
  const resetFilters = useCallback(() => {
    setFilters({
      page: 1,
      pageSize: 12,
      sortBy: 'createdAt',
      sortOrder: 'desc',
    });
  }, []);

  return {
    suppliers: data?.data?.result || [],
    meta: data?.data?.meta,
    isLoading,
    isError,
    error,
    filters,
    refetch,
    handlePageChange,
    handlePageSizeChange,
    handleSearch,
    handleSortChange,
    resetFilters,
  };
};

export default useSuppliers; 