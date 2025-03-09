import { MerchandiseResponse, MerchandiseTimeframe, MerchandiseMetric } from '../types/merchandise';
import { mockMerchandiseData } from '../utils/mockData';

export const fetchMerchandiseData = async (
  timeframe: MerchandiseTimeframe,
  metric: MerchandiseMetric
): Promise<MerchandiseResponse> => {
  // Khi có API thật, thay thế phần này
  return mockMerchandiseData(timeframe, metric);
}; 