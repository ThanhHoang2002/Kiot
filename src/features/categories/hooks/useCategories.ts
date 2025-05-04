import { useQuery } from "@tanstack/react-query";
import { useState } from "react";

import { getCategories } from "../api/categoryApi";
import { CategoryFilterParams } from "../types";

export const useCategories = (initialFilters: CategoryFilterParams = {}) => {
  const [filters, setFilters] = useState<CategoryFilterParams>({
    page: 1,
    pageSize: 10,
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
    queryKey: ["categories", filters],
    queryFn: () => getCategories(filters),
  });

  // Thay đổi trang
  const handlePageChange = (page: number) => {
    setFilters((prev) => ({ ...prev, page }));
  };

  // Thay đổi số lượng item trên một trang
  const handlePageSizeChange = (pageSize: number) => {
    setFilters((prev) => ({ ...prev, pageSize, page: 1 }));
  };

  // Tìm kiếm
  const handleSearch = (search: string) => {
    setFilters((prev) => ({ ...prev, search, page: 1 }));
  };

  // Thay đổi sắp xếp
  const handleSortChange = (sortBy: string, sortOrder: 'asc' | 'desc' = 'asc') => {
    setFilters((prev) => ({ ...prev, sortBy, sortOrder }));
  };

  // Reset bộ lọc
  const resetFilters = () => {
    setFilters({
      page: 1,
      pageSize: 10,
      sortBy: 'createdAt',
      sortOrder: 'desc',
    });
  };

  return {
    categories: data?.data?.result || [],
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