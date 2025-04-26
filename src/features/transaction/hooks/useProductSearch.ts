import { useInfiniteQuery } from '@tanstack/react-query';

import { searchProducts } from '../api/transactionApi';

import { ProductsResponse } from '@/features/products/types/product';
import { ApiResponse } from '@/types/apiResponse.type';

/**
 * Hook for searching products with infinite scrolling
 * @param keyword The search keyword
 * @returns Infinite query result with products data
 */
export const useProductSearch = (keyword: string) => {
  return useInfiniteQuery<ApiResponse<ProductsResponse>, Error>({
    queryKey: ['products', keyword],
    queryFn: ({ pageParam }) => {
      const page = pageParam as number ?? 1;
      return searchProducts({ 
        keyword, 
        page, 
        limit: 10 
      });
    },
    initialPageParam: 1,
    getNextPageParam: (lastPage, allPages) => {
      // Kiểm tra xem có trang tiếp theo không
      const maxPage = Math.ceil(lastPage.data.meta.total / 10);
      const nextPage = allPages.length + 1;
      return nextPage <= maxPage ? nextPage : undefined;
    },
    enabled: keyword.trim().length > 0,
    staleTime: 1000 * 60 * 5, // 5 minutes
  });
}; 