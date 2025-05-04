import { Item, sfAnd, sfLike, sfGe, sfLe } from "spring-filter-query-builder";

import { InvoiceFilterParams, InvoiceResponse } from '../types/invoice';

import axiosClient from '@/lib/axios';

const BASE_PATH = '/orders';

export const getInvoices = async (
  params: InvoiceFilterParams
): Promise<InvoiceResponse> => {
  const filter = sfAnd(
    [
      // Sử dụng search để tìm số điện thoại khách hàng
      params.search && sfLike("customer.phone", params.search.toString()),
      // Nếu có startDate thì dùng greaterThanOrEqual
      params.startDate && sfGe("createdAt", params.startDate),
      // Nếu có endDate thì dùng lessThanOrEqual
      params.endDate && sfLe("createdAt", params.endDate),
    ].filter(Boolean) as Item[]
  );

  const response = await axiosClient.get<InvoiceResponse>(
    BASE_PATH,
    {
      params: {
        page: params.page || 1,
        size: params.pageSize || 10,
        filter: filter.toString() === "()" ? undefined : filter.toString(), // Nếu không có filter thì không truyền vào params
      },
    }
  );
  
  return response.data;
};

export const getInvoiceById = async (id: number): Promise<InvoiceResponse> => {
  const response = await axiosClient.get<InvoiceResponse>(`${BASE_PATH}/${id}`);
  return response.data;
}; 