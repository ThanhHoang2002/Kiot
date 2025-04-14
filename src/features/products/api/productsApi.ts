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

export const updateProduct = async (
  updateData: Partial<Product>
) => {
  return updateData;
};
export const deleteProduct = async (id: number): Promise<void> => {
  await axiosClient.delete(`products/${id}`);
};
