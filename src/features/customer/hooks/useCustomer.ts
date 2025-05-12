import { useQuery } from '@tanstack/react-query';

import { fetchCustomerById } from '../api/customerApi';

export const useCustomer = (id: number) => {
  return useQuery({
    queryKey: ['customer', id],
    queryFn: () => fetchCustomerById(id),
    enabled: !!id,
  });
}; 