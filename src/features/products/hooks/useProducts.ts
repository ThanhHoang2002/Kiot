import { useQuery } from '@tanstack/react-query';

import { fetchProducts, ProductsParams } from '../api/productsApi';


export const useProducts = (params : ProductsParams) => {
  return useQuery({
    queryKey: ['products', params],
    queryFn: () => fetchProducts(params),
})
}
