import { sfLike } from "spring-filter-query-builder";

import {
  Customer,
  CustomersSearchResponse,
  SearchCustomersParams,
  SearchProductsParams,
} from "../types";

import { ProductsResponse } from "@/features/products/types/product";
import axiosClient from "@/lib/axios";
import { ApiResponse } from "@/types/apiResponse.type";
// Product API
export const searchProducts = async (
  params: SearchProductsParams
): Promise<ApiResponse<ProductsResponse>> => {
    const filter = params.keyword && sfLike("name", params.keyword)

    const response = await axiosClient.get(`/products`, {
      params: {
        page: params.page,
        size: params.limit,
        filter: filter.toString() === "()" ? undefined : filter.toString(),
      },
    });
    return response.data;
};

// Customer API
export const searchCustomers = async (
  params: SearchCustomersParams
): Promise<CustomersSearchResponse> => {
  try {
    const response = await axiosClient.get(`/customers/search`, {
      params,
    });
    return response.data;
  } catch (error) {
    console.error("Error searching customers:", error);
    throw error;
  }
};

export const getCustomerByPhone = async (
  phone: string
): Promise<Customer | null> => {
  const response = await axiosClient.get(`/customers/phone/${phone}`);
  return response.data;
};
