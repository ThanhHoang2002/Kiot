import { useQuery } from '@tanstack/react-query';
import React from 'react';

import { StatItem } from './StatItem';
import { TodayStatisticsSkeleton } from './TodayStatisticsSkeleton';
import { fetchTodayStatistics } from '../../api/statisticsApi';

import { Card } from '@/components/ui/card';
import formatCurrency from '@/utils/formatCurrency';

export const TodayStatistics: React.FC = () => {
  const { data, isLoading } = useQuery({
    queryKey: ['statistics', 'today'],
    queryFn: fetchTodayStatistics,
    refetchInterval: 5 * 60 * 1000, 
  });

  if (isLoading) return <TodayStatisticsSkeleton />;
  if (!data) return null;
  return (
    <Card className="p-4">
      <h2 className="mb-4 text-xl font-bold">KẾT QUẢ BÁN HÀNG HÔM NAY</h2>
      <div className="grid grid-cols-4 gap-8">
        <StatItem 
          label={formatCurrency(data.value)}
          type="revenue"
          sublabel="Doanh thu"
        />
        <StatItem 
          label={data.count.toString()}
          type="orders"
          sublabel="Đơn hàng"
        />
        <StatItem 
          label={`${data.compareYesterday.trend === 'up' ? '+' : ''}${data.compareYesterday.percentage.toFixed(2)}%`}
          type="compare"
          trend={data.compareYesterday.trend}
          sublabel="So với hôm qua"
        />
        <StatItem 
          label={`${data.compareLastMonth.trend === 'up' ? '+' : ''}${data.compareLastMonth.percentage.toFixed(2)}%`}
          type="compare"
          trend={data.compareLastMonth.trend}
          sublabel="So với cùng kỳ tháng trước"
        />
      </div>
    </Card>
  );
}; 