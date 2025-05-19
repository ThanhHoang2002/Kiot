import { RevenueResponse, RevenueTimeframe } from '../types/revenue';

import axiosClient from '@/lib/axios';
import { ApiResponse } from '@/types/apiResponse.type';

export const fetchRevenueDetails = async (
  month: string,
  type: RevenueTimeframe
): Promise<RevenueResponse> => {
  const time = month.split('-')
  const response = await axiosClient.get<ApiResponse<RevenueResponse>>(`/statistics/details?month=${time[1]}&year=${time[0]}&type=${type}`)
  return response.data.data;
}; 