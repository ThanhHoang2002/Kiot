import { useInfiniteQuery, useQuery } from '@tanstack/react-query';

import { getCustomerByPhone, searchCustomers } from '../api/transactionApi';
import { CustomerApiResponse } from '../types';

/**
 * Hook for searching customers by keyword
 * @param keyword The search keyword
 * @returns InfiniteQuery result with customers data
 */
export const useCustomerSearch = (keyword: string) => {
  return useInfiniteQuery<CustomerApiResponse, Error>({
    queryKey: ['customers', keyword],
    queryFn: ({ pageParam }) => 
      searchCustomers({ 
        keyword, 
        page: pageParam as number, 
        limit: 10 
      }),
    initialPageParam: 1,
    getNextPageParam: (lastPage) => {
      if (!lastPage?.data?.meta) return undefined;
      
      const { page, pages } = lastPage.data.meta;
      return page < pages ? page + 1 : undefined;
    },
    enabled: keyword.trim().length > 0,
    staleTime: 1000 * 60 * 5, // 5 minutes
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