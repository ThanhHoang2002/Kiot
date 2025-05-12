import { stringify } from 'qs';
import { Item, sfLike, sfOr } from "spring-filter-query-builder";

import { Category, CategoryFilterParams, CategoryResponse, CreateCategoryPayload, UpdateCategoryPayload } from "../types";

import axiosClient from "@/lib/axios";
import { ApiResponse } from "@/types/apiResponse.type";

const BASE_PATH = '/categories';

// Memoization cache for getCategories requests
const categoriesCache = new Map<string, Promise<CategoryResponse>>();

/**
 * Build filter string from filter params
 */
const buildFilterString = (params: CategoryFilterParams): string | undefined => {
  const filterItems: Item[] = [];
  
  // Điều kiện tìm kiếm theo tên danh mục
  if (params.search) {
    // Tìm kiếm theo name
    filterItems.push(
      sfOr([
        sfLike('name', `*${params.search}*`),
      ])
    );
  }
  
  // Tạo filter string từ các điều kiện
  if (filterItems.length === 0) {
    return undefined;
  }
  
  if (filterItems.length === 1) {
    return filterItems[0].toString();
  }
  
  // Kết hợp các điều kiện với AND
  return filterItems.map(item => item.toString()).join(' and ');
};

/**
 * Build request params for API call
 */
const buildRequestParams = (params: CategoryFilterParams, filterStr?: string) => {
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
  
  return requestParams;
};

/**
 * Lấy danh sách danh mục với phân trang và tìm kiếm
 */
export const getCategories = async (params: CategoryFilterParams = {}): Promise<CategoryResponse> => {
  // Build filter string
  const filterStr = buildFilterString(params);
  
  // Build request params
  const requestParams = buildRequestParams(params, filterStr);
  
  // Create cache key from params
  const cacheKey = stringify(requestParams);
  
  // Check if we have a cached promise for this request
  if (categoriesCache.has(cacheKey)) {
    return categoriesCache.get(cacheKey)!;
  }
  
  // Make the request and cache the promise
  const requestPromise = axiosClient.get<CategoryResponse>(BASE_PATH, { params: requestParams })
    .then(response => {
      // After request completes, keep cache for a short time then remove
      setTimeout(() => {
        categoriesCache.delete(cacheKey);
      }, 30000); // 30 seconds cache
      
      return response.data;
    });
  
  // Store the promise in cache
  categoriesCache.set(cacheKey, requestPromise);
  
  return requestPromise;
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
  // Use FormData only when we have an image, otherwise use JSON
  if (categoryData.image) {
    const formData = new FormData();
    formData.append("name", categoryData.name);
    formData.append("description", categoryData.description);
    formData.append("image", categoryData.image);

    const response = await axiosClient.post<ApiResponse<Category>>(BASE_PATH, formData, {
      headers: {
        "Content-Type": "multipart/form-data",
      },
    });
    return response.data;
  } else {
    // Use JSON payload when no image is present for better performance
    const response = await axiosClient.post<ApiResponse<Category>>(BASE_PATH, {
      name: categoryData.name,
      description: categoryData.description
    });
    return response.data;
  }
};

/**
 * Cập nhật danh mục
 */
export const updateCategory = async (id: number, categoryData: UpdateCategoryPayload): Promise<ApiResponse<Category>> => {
  // Use FormData only when we have an image, otherwise use JSON for better performance
  if (categoryData.image) {
    const formData = new FormData();
    
    if (categoryData.name) {
      formData.append("name", categoryData.name);
    }
    
    if (categoryData.description) {
      formData.append("description", categoryData.description);
    }
    
    formData.append("image", categoryData.image);

    const response = await axiosClient.put<ApiResponse<Category>>(`${BASE_PATH}/${id}`, formData, {
      headers: {
        "Content-Type": "multipart/form-data",
      },
    });
    return response.data;
  } else {
    // Use JSON payload when no image is present
    const payload: Record<string, string> = {};
    
    if (categoryData.name) {
      payload.name = categoryData.name;
    }
    
    if (categoryData.description) {
      payload.description = categoryData.description;
    }
    
    const response = await axiosClient.put<ApiResponse<Category>>(`${BASE_PATH}/${id}`, payload);
    return response.data;
  }
};

/**
 * Xóa danh mục
 */
export const deleteCategory = async (id: number): Promise<ApiResponse<{ success: boolean }>> => {
  const response = await axiosClient.delete<ApiResponse<{ success: boolean }>>(`${BASE_PATH}/${id}`);
  return response.data;
}; 