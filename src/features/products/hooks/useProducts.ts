import { useQuery } from '@tanstack/react-query';
import { useState } from 'react';

import { fetchProducts } from '../api/productsApi';

export const useProducts = (initialPage = 1, initialLimit = 10) => {
  const [selectedProducts, setSelectedProducts] = useState<string[]>([]);
  const [page, setPage] = useState(initialPage);
  const [limit] = useState(initialLimit);
  const [search, setSearch] = useState('');

  const { data, isLoading } = useQuery({
    queryKey: ['products', page, limit, search],
    queryFn: () => fetchProducts({ page, limit, search }),
  });

  const handleToggleSelect = (productId: string) => {
    setSelectedProducts(prev => 
      prev.includes(productId) 
        ? prev.filter(id => id !== productId)
        : [...prev, productId]
    );
  };

  const handleSelectAll = (value?:boolean) => {
    if (!data) return;
    if(value===true){
          setSelectedProducts(prev => 
          prev.length === data.data.length ? [] : data.data.map(p => p.id)
        );
      }else{
        setSelectedProducts([])
      }
  };

  const handlePageChange = (newPage: number) => {
    setPage(newPage);
    window.scrollTo({ top: 0, behavior: 'smooth' })
  };

  const handleSearch = (value: string) => {
    setSearch(value);
    setPage(1);
  };
  return {
    data,
    isLoading,
    page,
    limit,
    selectedProducts,
    handleToggleSelect,
    handleSelectAll,
    handlePageChange,
    handleSearch,
  };
}; 