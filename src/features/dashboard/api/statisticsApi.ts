import { TodayStatistics } from '../types/statistics';
import { mockTodayStatistics } from '../utils/mockData';

export const fetchTodayStatistics = async (): Promise<TodayStatistics> => {
  // Khi có API thật, chỉ cần thay đổi phần này
  return mockTodayStatistics();
}; 