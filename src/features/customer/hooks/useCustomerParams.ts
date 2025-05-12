import { useCallback } from 'react';
import { useSearchParams } from 'react-router-dom';

import { CustomerParams } from '../types/customer';

export const useCustomerParams = () => {
  const [searchParams, setSearchParams] = useSearchParams();

  const filters: CustomerParams = {
    page: Number(searchParams.get('page')) || 1,
    size: Number(searchParams.get('size')) || 10,
    search: searchParams.get('search') || undefined,
    active: searchParams.get('active') === 'true' ? true : 
            searchParams.get('active') === 'false' ? false : undefined,
  };

  const updateFilters = useCallback(
    (newFilters: Partial<CustomerParams>) => {
      const updatedParams = new URLSearchParams(searchParams);

      // Cập nhật chỉ các params mới
      Object.entries(newFilters).forEach(([key, value]) => {
        if (value !== undefined) {
          if (key === 'search') {
            updatedParams.set('page', '1');
          }
          updatedParams.set(key, value.toString().trim());
        } else {
          updatedParams.delete(key);
        }
      });

      setSearchParams(updatedParams);
    },
    [searchParams, setSearchParams]
  );
  
  return { filters, updateFilters };
}; 