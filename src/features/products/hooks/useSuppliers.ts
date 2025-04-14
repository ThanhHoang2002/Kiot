import { useQuery } from '@tanstack/react-query';

import { fetchSuppliers } from '../api/supplierApi';

export const useSuppliers = () => {
  return useQuery({
    queryKey: ['suppliers'],
    queryFn: () => fetchSuppliers(),
  });
}; 