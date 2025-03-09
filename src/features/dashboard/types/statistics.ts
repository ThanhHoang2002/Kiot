export type TrendType = 'up' | 'down' | 'stable';

export interface CompareStats {
  percentage: number;
  trend: TrendType;
}

export interface TodayStatistics {
  value: number;
  count: number;
  compareYesterday: CompareStats;
  compareLastMonth: CompareStats;
} 