import { ApiResponse, Meta } from "@/types/apiResponse.type";

export interface Supplier {
  id: number;
  name: string;
  image: string;
  description: string;
  createdAt: string;
  updatedAt: string | null;
  createdBy: string;
  updatedBy: string | null;
}

export interface SupplierPagination {
  meta: Meta;
  result: Supplier[];
}

export type SupplierResponse = ApiResponse<SupplierPagination>;

export interface SupplierFilterParams {
  search?: string;      // Tìm kiếm theo tên và mô tả
  page?: number;        // Trang hiện tại
  pageSize?: number;    // Số item trên một trang
  sortBy?: string;      // Sắp xếp theo trường nào
  sortOrder?: 'asc' | 'desc';  // Thứ tự sắp xếp
}

export interface CreateSupplierPayload {
  name: string;
  description: string;
  image?: File;
}

export interface UpdateSupplierPayload {
  name?: string;
  description?: string;
  image?: File;
} 