import { Item, sfLike, sfOr } from "spring-filter-query-builder";

import { Category, CategoryFilterParams, CategoryResponse, CreateCategoryPayload, UpdateCategoryPayload } from "../types";

import axiosClient from "@/lib/axios";
import { ApiResponse } from "@/types/apiResponse.type";

const BASE_PATH = '/categories';

/**
 * Lấy danh sách danh mục với phân trang và tìm kiếm
 */
export const getCategories = async (params: CategoryFilterParams = {}): Promise<CategoryResponse> => {
  // Xây dựng filter từ các điều kiện cơ bản
  const filterItems: Item[] = [];
  
  // Điều kiện tìm kiếm theo tên danh mục
  if (params.search) {
    // Tìm kiếm theo name hoặc description
    filterItems.push(
      sfOr([
        sfLike('name', `*${params.search}*`),
      ])
    );
  }
  
  // Tạo filter string từ các điều kiện
  let filterStr: string | undefined;
  if (filterItems.length > 0) {
    if (filterItems.length === 1) {
      filterStr = filterItems[0].toString();
    } else {
      // Kết hợp các điều kiện với AND
      filterStr = filterItems.map(item => item.toString()).join(' and ');
    }
  }
  
  // Chuẩn bị tham số cho request
  const requestParams: {
    page?: number;
    size?: number;
    filter?: string;
    sort?: string;
  } = {
    page: params.page || 1,
    size: params.pageSize || 20,
  };
  
  // Nếu có filter, thêm vào request params
  if (filterStr) {
    requestParams.filter = filterStr;
  }
  
  // Xử lý sắp xếp
  if (params.sortBy) {
    const sortDirection = params.sortOrder === 'desc' ? 'desc' : 'asc';
    requestParams.sort = `${params.sortBy},${sortDirection}`;
  }
  
  const response = await axiosClient.get<CategoryResponse>(BASE_PATH, { params: requestParams });
  return response.data;
};

/**
 * Lấy chi tiết một danh mục theo ID
 */
export const getCategoryById = async (id: number): Promise<ApiResponse<Category>> => {
  const response = await axiosClient.get<ApiResponse<Category>>(`${BASE_PATH}/${id}`);
  return response.data;
};

/**
 * Tạo mới danh mục
 */
export const createCategory = async (categoryData: CreateCategoryPayload): Promise<ApiResponse<Category>> => {
  const formData = new FormData();
  formData.append("name", categoryData.name);
  formData.append("description", categoryData.description);
  
  if (categoryData.image) {
    formData.append("image", categoryData.image);
  }

  const response = await axiosClient.post<ApiResponse<Category>>(BASE_PATH, formData, {
    headers: {
      "Content-Type": "multipart/form-data",
    },
  });
  return response.data;
};

/**
 * Cập nhật danh mục
 */
export const updateCategory = async (id: number, categoryData: UpdateCategoryPayload): Promise<ApiResponse<Category>> => {
  const formData = new FormData();
  
  if (categoryData.name) {
    formData.append("name", categoryData.name);
  }
  
  if (categoryData.description) {
    formData.append("description", categoryData.description);
  }
  
  if (categoryData.image) {
    formData.append("image", categoryData.image);
  }

  const response = await axiosClient.patch<ApiResponse<Category>>(`${BASE_PATH}/${id}`, formData, {
    headers: {
      "Content-Type": "multipart/form-data",
    },
  });
  return response.data;
};

/**
 * Xóa danh mục
 */
export const deleteCategory = async (id: number): Promise<ApiResponse<{ success: boolean }>> => {
  const response = await axiosClient.delete<ApiResponse<{ success: boolean }>>(`${BASE_PATH}/${id}`);
  return response.data;
}; 