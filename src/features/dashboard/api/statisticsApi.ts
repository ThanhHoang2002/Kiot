import { TodayStatistics } from '../types/statistics';

import axiosClient from '@/lib/axios';
import { ApiResponse } from '@/types/apiResponse.type';

export const fetchTodayStatistics = async (): Promise<TodayStatistics> => {
  const response = await axiosClient.get<ApiResponse<TodayStatistics>>(`/statistics/today`)
  return response.data.data;
}; 