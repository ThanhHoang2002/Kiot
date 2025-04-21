import { useQuery } from '@tanstack/react-query';

import { getCustomerByPhone, searchCustomers } from '../api/transactionApi';
import { CustomersSearchResponse } from '../types';

/**
 * Hook for searching customers by keyword
 * @param keyword The search keyword
 * @returns Query result with customers data
 */
export const useCustomerSearch = (keyword: string) => {
  return useQuery<CustomersSearchResponse, Error>({
    queryKey: ['customers', 'search', keyword],
    queryFn: () => searchCustomers({ keyword, limit: 5 }),
    enabled: keyword.trim().length > 0,
    staleTime: 1000 * 60 * 5, // 5 minutes
    placeholderData: {
      data: [],
      total: 0,
      page: 1,
      limit: 5,
    },
  });
};

/**
 * Hook for finding a customer by phone number
 * @param phone The phone number
 * @returns Query result with customer data
 */
export const useCustomerByPhone = (phone: string) => {
  return useQuery({
    queryKey: ['customers', 'phone', phone],
    queryFn: () => getCustomerByPhone(phone),
    enabled: phone.trim().length > 0,
    staleTime: 1000 * 60 * 5, // 5 minutes
  });
}; 