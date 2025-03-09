export type MerchandiseTimeframe = 'today' | 'week' | 'month' | 'year';
export type MerchandiseMetric = 'revenue' | 'quantity';

export interface MerchandiseItem {
  id: string;
  name: string;
  value: number;
}

export interface MerchandiseResponse {
  items: MerchandiseItem[];
  timeframe: MerchandiseTimeframe;
  metric: MerchandiseMetric;
} 