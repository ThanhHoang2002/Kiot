import { useQuery } from '@tanstack/react-query';

import { getInvoices } from '../api/invoice';
import { InvoiceFilterParams } from '../types/invoice';

export const useInvoices = (params: InvoiceFilterParams) => {
  return useQuery({
    queryKey: ['invoices', params],
    queryFn: () => getInvoices(params),
    staleTime: 30 * 1000, // 30 giây
  });
}; 