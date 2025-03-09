import { create } from 'zustand';

import { MerchandiseTimeframe, MerchandiseMetric } from '../types/merchandise';

interface MerchandiseStore {
  timeframe: MerchandiseTimeframe;
  metric: MerchandiseMetric;
  setTimeframe: (timeframe: MerchandiseTimeframe) => void;
  setMetric: (metric: MerchandiseMetric) => void;
}

export const useMerchandiseStore = create<MerchandiseStore>((set) => ({
  timeframe: 'month',
  metric: 'revenue',
  setTimeframe: (timeframe) => set({ timeframe }),
  setMetric: (metric) => set({ metric }),
})); 