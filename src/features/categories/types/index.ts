import { ApiResponse, Meta } from "@/types/apiResponse.type";

export interface Category {
  id: number;
  name: string;
  image: string;
  description: string;
  createdAt: string;
  updatedAt: string | null;
  createdBy: string;
  updatedBy: string | null;
}

export interface CategoryPagination {
  meta: Meta;
  result: Category[];
}

export type CategoryResponse = ApiResponse<CategoryPagination>;

export interface CategoryFilterParams {
  search?: string;      // Tìm kiếm theo tên và mô tả
  page?: number;        // Trang hiện tại
  pageSize?: number;    // Số item trên một trang
  sortBy?: string;      // Sắp xếp theo trường nào
  sortOrder?: 'asc' | 'desc';  // Thứ tự sắp xếp
}

export interface CreateCategoryPayload {
  name: string;
  description: string;
  image?: File;
}

export interface UpdateCategoryPayload {
  name?: string;
  description?: string;
  image?: File;
} 