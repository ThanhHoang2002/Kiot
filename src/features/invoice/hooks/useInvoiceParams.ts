import { useCallback } from "react";
import { useSearchParams } from "react-router-dom";

import { InvoiceFilterParams } from "../types/invoice";

export const useInvoiceParams = () => {
  const [searchParams, setSearchParams] = useSearchParams();

  const filters: InvoiceFilterParams = {
    page: Number(searchParams.get("page")) || 1,
    pageSize: Number(searchParams.get("size")) || 10,
    search: searchParams.get("search") || undefined,
    startDate: searchParams.get("startDate") || undefined,
    endDate: searchParams.get("endDate") || undefined,
  };

  const updateFilters = useCallback(
    (newFilters: Partial<InvoiceFilterParams>) => {
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