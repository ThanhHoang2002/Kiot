import { Item, sfAnd, sfEqual, sfLike } from "spring-filter-query-builder";

import { ImportHistory, ImportHistoryResponse } from "../types/import";

import axiosClient from "@/lib/axios";
import { ApiResponse } from "@/types/apiResponse.type";

export interface ImportParams {
  page?: number;
  size?: number;
  search?: string;
  supplierId?: number;
  startDate?: string;
  endDate?: string;
  userId?: number;
}

export const fetchImports = async (
  params: ImportParams
): Promise<ApiResponse<ImportHistoryResponse>> => {
  // Build filter conditions
  const filterConditions: Item[] = [];
  
  if (params.search) {
    filterConditions.push(sfLike("id", params.search));
  }
  
  if (params.supplierId) {
    filterConditions.push(sfEqual("supplier.id", params.supplierId));
  }
  
  if (params.userId) {
    filterConditions.push(sfEqual("user.id", params.userId));
  }
  
  // Handle date range as manual string filters
  let filterStr = "";
  if (filterConditions.length > 0) {
    filterStr = sfAnd(filterConditions).toString();
    
    // Remove enclosing parentheses if there's only one condition
    if (filterStr === "()") {
      filterStr = "";
    }
  }
  
  // Add date filters manually if needed
  if (params.startDate) {
    const dateFilter = `createdAt >= '${params.startDate}'`;
    filterStr = filterStr ? `${filterStr} and ${dateFilter}` : dateFilter;
  }
  
  if (params.endDate) {
    const dateFilter = `createdAt <= '${params.endDate}'`;
    filterStr = filterStr ? `${filterStr} and ${dateFilter}` : dateFilter;
  }
  
  const response = await axiosClient.get<ApiResponse<ImportHistoryResponse>>(
    "imports",
    {
      params: {
        page: params.page,
        size: params.size,
        filter: filterStr || undefined,
      },
    }
  );
  return response.data;
};

export const fetchImportDetails = async (
  id: number
): Promise<ImportHistory> => {
  const response = await axiosClient.get<ApiResponse<ImportHistory>>(
    `imports/${id}`
  );
  return response.data.data;
};

export const createImport = async (data: any): Promise<ImportHistory> => {
  const response = await axiosClient.post<ApiResponse<ImportHistory>>(
    "imports",
    data
  );
  return response.data.data;
};

export const deleteImport = async (id: number): Promise<void> => {
  await axiosClient.delete(`imports/${id}`);
};

export const uploadImportExcel = async (file: File): Promise<ApiResponse<ImportHistory>> => {
  const formData = new FormData();
  formData.append('file', file);
  
  const response = await axiosClient.post<ApiResponse<ImportHistory>>(
    "imports/upload",
    formData,
    {
      headers: {
        'Content-Type': 'multipart/form-data',
      },
    }
  );
  return response.data;
}; 