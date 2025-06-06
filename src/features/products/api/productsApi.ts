import { AxiosError } from "axios";
import { Item, sfAnd, sfEqual, sfLike } from "spring-filter-query-builder";

import { Product, ProductsResponse } from "../types/product";

import axiosClient from "@/lib/axios";
import { ApiResponse } from "@/types/apiResponse.type";

export interface ProductsParams {
  page?: number;
  size?: number;
  search?: string;
  categoryId?: number;
  status?: string;
  supplierId?: number;
}
export const fetchProducts = async (
  params: ProductsParams
): Promise<ApiResponse<ProductsResponse>> => {
  const filter = sfAnd(
    [
      params.search && sfLike("name", params.search),
      params.categoryId && sfEqual("category.id", params.categoryId),
      params.status && sfEqual("status", params.status),
      params.supplierId && sfEqual("supplier.id", params.supplierId),
    ].filter(Boolean) as Item[]
  );
  
  const response = await axiosClient.get<ApiResponse<ProductsResponse>>(
    "products",
    {
      params: {
        page: params.page,
        size: params.size,
        filter: filter.toString()==="()"?undefined:filter.toString(), // Nếu không có filter thì không truyền vào params
      },
    }
  );
  return response.data;
};

export const fetchDetailsProduct = async (
  id: number
): Promise<Product> => {
  const response = await axiosClient.get<ApiResponse<Product>>(
    `products/${id}`
  );
  return response.data.data;
};

export const createProduct = async (formData: FormData): Promise<Product> => {
  try {
    const response = await axiosClient.post<ApiResponse<Product>>(
      "products", 
      formData,
      {
      headers: {
        "Content-Type": "multipart/form-data",
      },
    }
  );
  return response.data.data;
  } catch (error) {
    if (error instanceof AxiosError) {
      throw error
    }
    throw new Error("Lỗi khi tạo sản phẩm")
  }
};

export const updateProduct = async (
  id: string | number,
  formData: FormData
): Promise<Product> => {
  try {
    const response = await axiosClient.put<ApiResponse<Product>>(
      `products/${id}`,
      formData,
      {
      headers: {
        "Content-Type": "multipart/form-data",
      },
    }
  );
  return response.data.data;
  } catch (error) {
    if (error instanceof AxiosError) {
      throw error
    }
    throw new Error("Lỗi khi cập nhật sản phẩm")
  }
};

export const deleteProduct = async (id: number): Promise<void> => {
  try {
    await axiosClient.delete(`products/${id}`);
  } catch (error) {
    if (error instanceof AxiosError) {
      throw error
    }
    throw new Error("Lỗi khi xóa sản phẩm")
  }
};
