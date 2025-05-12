import { Item, sfAnd, sfEqual, sfLike } from "spring-filter-query-builder";

import { Customer, CustomerParams, CustomersResponse } from "../types/customer";

import axiosClient from "@/lib/axios";
import { ApiResponse } from "@/types/apiResponse.type";

const BASE_PATH = "/customers";

export const fetchCustomers = async (
  params: CustomerParams
): Promise<ApiResponse<CustomersResponse>> => {
  const filter = sfAnd(
    [
      params.search && sfLike("fullname", params.search),
      params.active !== undefined && sfEqual("active", params.active.toString()),
    ].filter(Boolean) as Item[]
  );
  
  const response = await axiosClient.get<ApiResponse<CustomersResponse>>(
    BASE_PATH,
    {
      params: {
        page: params.page,
        size: params.size,
        filter: filter.toString() === "()" ? undefined : filter.toString(),
      },
    }
  );
  return response.data;
};

export const fetchCustomerById = async (
  id: number
): Promise<Customer> => {
  const response = await axiosClient.get<ApiResponse<Customer>>(
    `${BASE_PATH}/${id}`
  );
  return response.data.data;
};

export const createCustomer = async (
  customerData: Omit<Customer, "id" | "createdAt" | "updatedAt" | "createdBy" | "updatedBy" | "point">
): Promise<Customer> => {
  const response = await axiosClient.post<ApiResponse<Customer>>(
    BASE_PATH,
    customerData
  );
  return response.data.data;
};

export const updateCustomer = async (
  id: number,
  updateData: Partial<Customer>
): Promise<Customer> => {
  const response = await axiosClient.put<ApiResponse<Customer>>(
    `${BASE_PATH}/${id}`,
    updateData
  );
  return response.data.data;
};

export const deleteCustomer = async (id: number): Promise<void> => {
  await axiosClient.delete(`${BASE_PATH}/${id}`);
}; 