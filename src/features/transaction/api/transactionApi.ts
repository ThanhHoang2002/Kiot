import { AxiosError } from "axios";
import { sfLike } from "spring-filter-query-builder";

import {
  Customer,
  CustomerApiResponse,
  OrdersPayload,
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
): Promise<CustomerApiResponse> => {

    const filter = params.keyword && sfLike("phone",params.keyword)
    
    const response = await axiosClient.get(`/customers`, {
      params: {
        filter,
        page: params.page || 1,
        size: params.limit || 10,
      },
    });
    return response.data;
};

export const getCustomerByPhone = async (
  phone: string
): Promise<Customer | null> => {
  const response = await axiosClient.get(`/customers/phone/${phone}`);
  return response.data;
};

export const processPayment = async (transaction: OrdersPayload) => {
  try {
    const response = await axiosClient.post('/orders', transaction);
    return response.data;
  } catch (error: unknown) {
    // Handle error and extract info from response if available
    if (error instanceof AxiosError && error.response) {
      const { status, data } = error.response;
      throw {
        status,
        message: data.error || 'Payment processing failed',
        error: data,
      };
    }
    throw new Error('Failed to process payment');
  }
};
