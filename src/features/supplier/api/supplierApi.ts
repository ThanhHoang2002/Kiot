import { Item, sfLike, sfOr } from "spring-filter-query-builder";

import { Supplier, SupplierFilterParams, SupplierResponse, CreateSupplierPayload, UpdateSupplierPayload } from "../types";

import axiosClient from "@/lib/axios";
import { ApiResponse } from "@/types/apiResponse.type";

const BASE_PATH = '/suppliers';

/**
 * Lấy danh sách nhà cung cấp với phân trang và tìm kiếm
 */
export const getSuppliers = async (params: SupplierFilterParams = {}): Promise<SupplierResponse> => {
  // Xây dựng filter từ các điều kiện cơ bản
  const filterItems: Item[] = [];
  
  // Điều kiện tìm kiếm theo tên nhà cung cấp hoặc mô tả
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
    size: params.pageSize || 12,
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
  
  const response = await axiosClient.get<SupplierResponse>(BASE_PATH, { params: requestParams });
  return response.data;
};

/**
 * Lấy chi tiết một nhà cung cấp theo ID
 */
export const getSupplierById = async (id: number): Promise<ApiResponse<Supplier>> => {
  const response = await axiosClient.get<ApiResponse<Supplier>>(`${BASE_PATH}/${id}`);
  return response.data;
};

/**
 * Tạo mới nhà cung cấp
 */
export const createSupplier = async (supplierData: CreateSupplierPayload): Promise<ApiResponse<Supplier>> => {
  const formData = new FormData();
  formData.append("name", supplierData.name);
  formData.append("description", supplierData.description);
  
  if (supplierData.image) {
    formData.append("image", supplierData.image);
  }

  const response = await axiosClient.post<ApiResponse<Supplier>>(BASE_PATH, formData, {
    headers: {
      "Content-Type": "multipart/form-data",
    },
  });
  return response.data;
};

/**
 * Cập nhật nhà cung cấp
 */
export const updateSupplier = async (id: number, supplierData: UpdateSupplierPayload): Promise<ApiResponse<Supplier>> => {
  const formData = new FormData();
  
  if (supplierData.name) {
    formData.append("name", supplierData.name);
  }
  
  if (supplierData.description) {
    formData.append("description", supplierData.description);
    
  }
  
  if (supplierData.image) {
    formData.append("image", supplierData.image);
  }

  const response = await axiosClient.put<ApiResponse<Supplier>>(`${BASE_PATH}/${id}`, formData, {
    headers: {
      "Content-Type": "multipart/form-data",
    },
  });
  return response.data;
};

/**
 * Xóa nhà cung cấp
 */
export const deleteSupplier = async (id: number): Promise<ApiResponse<{ success: boolean }>> => {
  const response = await axiosClient.delete<ApiResponse<{ success: boolean }>>(`${BASE_PATH}/${id}`);
  return response.data;
}; 