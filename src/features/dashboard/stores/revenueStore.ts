import { create } from 'zustand';

import { RevenueTimeframe } from '../types/revenue';

interface RevenueStore {
  timeframe: RevenueTimeframe;
  month: string;
  setTimeframe: (timeframe: RevenueTimeframe) => void;
  setMonth: (month: string) => void;
}

const getCurrentMonth = () => {
  const date = new Date();
  return `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, '0')}`;
};

export const useRevenueStore = create<RevenueStore>((set) => ({
  timeframe: 'daily',
  month: getCurrentMonth(),
  setTimeframe: (timeframe) => set({ timeframe }),
  setMonth: (month) => set({ month })
})); 