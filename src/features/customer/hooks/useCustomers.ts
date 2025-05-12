import { useQuery } from '@tanstack/react-query';

import { fetchCustomers } from '../api/customerApi';
import { CustomerParams } from '../types/customer';

export const useCustomers = (params: CustomerParams) => {
  return useQuery({
    queryKey: ['customers', params],
    queryFn: () => fetchCustomers(params),
  });
}; 