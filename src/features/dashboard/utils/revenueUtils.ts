import { RevenueItem } from '../types/revenue';

export const calculateTotal = (data: RevenueItem[]): number => {
  return data.reduce((sum, item) => sum + item.value, 0);
};
