import { useQuery } from '@tanstack/react-query';
import React from 'react';
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
  CartesianGrid,
} from 'recharts';

import { fetchRevenueDetails } from '../../api/revenueApi';
import { useRevenueStore } from '../../stores/revenueStore';

import { Skeleton } from '@/components/ui/skeleton';
import formatCurrency from '@/utils/formatCurrency';

// Define the data item type for revenue chart
interface RevenueDataItem {
  label: string;
  value: number;
}

export const RevenueChart: React.FC = () => {
  const { month, timeframe } = useRevenueStore();
  const { data, isLoading, error } = useQuery({
    queryKey: ['revenue', month, timeframe],
    queryFn: () => fetchRevenueDetails(month, timeframe),
  });

  if (isLoading) {
    return <Skeleton className="h-[300px] w-full" />;
  }

  if (error || !data) {
    return <div>Error loading revenue data</div>;
  }

  // Calculate maximum value for better YAxis scale
  const chartData = data.data as RevenueDataItem[];
  const maxValue = Math.max(...chartData.map(item => item.value));
  const yAxisDivisor = maxValue > 1000000 ? 1000000 : maxValue > 1000 ? 1000 : 1;
  const yAxisSuffix = maxValue > 1000000 ? 'M' : maxValue > 1000 ? 'K' : '';

  return (
      <ResponsiveContainer width="100%" height={300}>
        <BarChart data={chartData}>
          <CartesianGrid vertical={false} />
          <XAxis
            dataKey="label"
            tickFormatter={(value) => value}
          />
          <YAxis
            tickFormatter={(value) => {
              if (value === 0) return '0';
              return (value / yAxisDivisor).toFixed(0) + yAxisSuffix;
            }}
          />
          <Tooltip
            formatter={(value: number) => [formatCurrency(value), 'Doanh thu']}
            labelFormatter={(label) => {
              if (data.type === 'daily') {
                return `Ngày ${label}`;
              }
              if (data.type === 'hourly') {
                return `${label} giờ`;
              }
              return label;
            }}
            contentStyle={{ fontSize:'12px' }}
          />
          <Bar dataKey="value" fill="hsl(var(--primary))" />
        </BarChart>
      </ResponsiveContainer>
  );
}; 