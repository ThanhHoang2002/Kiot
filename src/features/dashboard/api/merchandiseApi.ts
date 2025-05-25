import { MerchandiseTimeframe, MerchandiseMetric, MerchandiseItem } from '../types/merchandise';

import axiosClient from '@/lib/axios';
import { ApiResponse } from '@/types/apiResponse.type';

export const fetchMerchandiseData = async (
  timeframe: MerchandiseTimeframe,
  metric: MerchandiseMetric
): Promise<MerchandiseItem[]> => {
  const response = await axiosClient.get<ApiResponse<MerchandiseItem[]>>(`/merchandise/top?timeframe=${timeframe}&metric=${metric}&limit=${10}`)
  return response.data.data;
}; 