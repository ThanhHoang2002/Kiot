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
import { formatCurrency } from '../../utils/revenueUtils';

import { Skeleton } from '@/components/ui/skeleton';

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

  return (
      <ResponsiveContainer width="100%" height={300}>
        <BarChart data={data.data}>
          <CartesianGrid vertical={false} />
          <XAxis
            dataKey={timeframe === 'daily' ? 'date' : timeframe === 'hourly' ? 'hour' : 'weekday'}
            tickFormatter={(value) => {
              if (timeframe === 'daily') {
                return value.split('-')[2]; // Get day from YYYY-MM-DD
              }
              return value;
            }}
          />
          <YAxis
            tickFormatter={(value) => {
              return (value / 1000000).toFixed(0) + 'M';
            }}
          />
          <Tooltip
            formatter={(value: number) => [formatCurrency(value), 'Doanh thu']}
            labelFormatter={(label) => {
              if (timeframe === 'daily') {
                return `Ngày ${label.split('-')[2]}`;
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