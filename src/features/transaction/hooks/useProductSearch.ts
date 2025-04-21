import { useQuery } from '@tanstack/react-query';

import { searchProducts } from '../api/transactionApi';

import { ProductsResponse } from '@/features/products/types/product';
import { ApiResponse } from '@/types/apiResponse.type';
/**
 * Hook for searching products
 * @param keyword The search keyword
 * @returns Query result with products data
 */
export const useProductSearch = (keyword: string) => {
  return useQuery<ApiResponse<ProductsResponse>, Error>({
    queryKey: ['products', keyword],
    queryFn: () => searchProducts({ keyword, page: 1, limit: 10 }),
    enabled: keyword.trim().length > 0,
    staleTime: 1000 * 60 * 5, // 5 minutes
  });
}; 