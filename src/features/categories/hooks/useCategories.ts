import { useQuery } from "@tanstack/react-query";
import { useState, useCallback } from "react";

import { getCategories } from "../api/categoryApi";
import { CategoryFilterParams, CategoryResponse } from "../types";

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
    isFetching,
  } = useQuery<CategoryResponse>({
    queryKey: ["categories", filters],
    queryFn: () => getCategories(filters),
    staleTime: 5 * 60 * 1000, // 5 minutes
    gcTime: 10 * 60 * 1000, // 10 minutes
    refetchOnWindowFocus: false, // Don't refetch automatically on window focus
  });

  // Memoize handler functions to prevent unnecessary re-renders
  const handlePageChange = useCallback((page: number) => {
    setFilters((prev) => ({ ...prev, page }));
  }, []);

  const handlePageSizeChange = useCallback((pageSize: number) => {
    setFilters((prev) => ({ ...prev, pageSize, page: 1 }));
  }, []);

  const handleSearch = useCallback((search: string) => {
    setFilters((prev) => ({ ...prev, search, page: 1 }));
  }, []);

  const handleSortChange = useCallback((sortBy: string, sortOrder: 'asc' | 'desc' = 'asc') => {
    setFilters((prev) => ({ ...prev, sortBy, sortOrder }));
  }, []);

  const resetFilters = useCallback(() => {
    setFilters({
      page: 1,
      pageSize: 10,
      sortBy: 'createdAt',
      sortOrder: 'desc',
    });
  }, []);

  return {
    categories: data?.data?.result || [],
    meta: data?.data?.meta,
    isLoading,
    isError,
    error,
    isFetching,
    filters,
    refetch,
    handlePageChange,
    handlePageSizeChange,
    handleSearch,
    handleSortChange,
    resetFilters,
  };
}; 