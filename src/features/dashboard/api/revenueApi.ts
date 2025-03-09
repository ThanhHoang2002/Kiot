import { RevenueResponse, RevenueTimeframe } from '../types/revenue';
import { mockRevenueDetails } from '../utils/mockData';

export const fetchRevenueDetails = async (
  month: string,
  type: RevenueTimeframe
): Promise<RevenueResponse> => {
  // Khi có API thật, chỉ cần thay đổi phần này
  return mockRevenueDetails(month, type);
}; 