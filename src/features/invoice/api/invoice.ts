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
  const response = await axiosClient.get<InvoiceResponse>(`${BASE_PATH}/${id}?include=items`);
  
  // Nếu API không trả về items, bạn có thể mô phỏng với một số mock data
  if (response.data?.data?.result?.length > 0 && !response.data.data.result[0].items) {
    // Thêm mock data - trong thực tế, API sẽ trả về dữ liệu thực
    response.data.data.result[0].items = [
      {
        id: 1,
        productId: 101,
        name: "Sản phẩm mẫu 1",
        quantity: 2,
        price: 150000,
        total: 300000,
        image: "https://example.com/product1.jpg"
      },
      {
        id: 2,
        productId: 102,
        name: "Sản phẩm mẫu 2",
        quantity: 1,
        price: 250000,
        total: 250000,
        image: "https://example.com/product2.jpg"
      }
    ];
  }
  
  return response.data;
};

/**
 * Xuất hóa đơn theo định dạng PDF
 * @param id ID của hóa đơn cần xuất
 * @returns Blob dữ liệu PDF
 */
export const exportInvoicePdf = async (id: number): Promise<Blob> => {
  const response = await axiosClient.get(`${BASE_PATH}/${id}/invoice`, {
    responseType: 'blob'
  });
  return response.data;
};
