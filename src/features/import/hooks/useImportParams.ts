import { useCallback } from "react";
import { useSearchParams } from "react-router-dom";

import { ImportParams } from "../api/importApi";

export const useImportParams = () => {
  const [searchParams, setSearchParams] = useSearchParams();

  const filters: ImportParams = {
    page: Number(searchParams.get("page")) || 1,
    size: Number(searchParams.get("size")) || 50,
    search: searchParams.get("search") || undefined,
    supplierId: Number(searchParams.get("supplierId")) || undefined,
    startDate: searchParams.get("startDate") || undefined,
    endDate: searchParams.get("endDate") || undefined,
    userId: Number(searchParams.get("userId")) || undefined,
  };

  const updateFilters = useCallback(
    (newFilters: Partial<ImportParams>) => {
      const updatedParams = new URLSearchParams(searchParams);

      // Cập nhật chỉ các params mới
      Object.entries(newFilters).forEach(([key, value]) => {
        if (value) {
          if (key === "search") {
            updatedParams.set("page", "1");
          }
          updatedParams.set(key, value.toString().trim());
        } else {
          updatedParams.delete(key);
        }
      });

      setSearchParams(updatedParams);
    },
    [searchParams, setSearchParams]
  );
  
  return { filters, updateFilters };
}; 