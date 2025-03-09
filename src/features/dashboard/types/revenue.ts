export type RevenueTimeframe = 'daily' | 'hourly' | 'weekday';

export interface RevenueItem {
  value: number;
  date?: string;    // for daily
  hour?: string;    // for hourly
  weekday?: string; // for weekday
}

export interface RevenueResponse {
  type: RevenueTimeframe;
  data: RevenueItem[];
}

export interface DailyRevenue {
  date: number;
  amount: number;
}

export interface HourlyRevenue {
  hour: number;
  amount: number;
}

export interface WeekdayRevenue {
  weekday: number; // 0-6 for Sunday-Saturday
  amount: number;
}

export type TimeframeData = {
  day: DailyRevenue[];
  hour: HourlyRevenue[];
  weekday: WeekdayRevenue[];
};

export interface RevenueData {
  totalRevenue: number;
  timeframeData: TimeframeData;
  timeframe: RevenueTimeframe;
  month: number; // 1-12 for January-December
  year: number;
}

export interface RevenueChartData {
  labels: string[];
  values: number[];
} 