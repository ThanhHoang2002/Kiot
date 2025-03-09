import { RevenueItem } from '../types/revenue';

export const calculateTotal = (data: RevenueItem[]): number => {
  return data.reduce((sum, item) => sum + item.value, 0);
};

export const formatCurrency = (value: number): string => {
  return new Intl.NumberFormat('vi-VN', {
    style: 'currency',
    currency: 'VND',
  }).format(value);
}; 