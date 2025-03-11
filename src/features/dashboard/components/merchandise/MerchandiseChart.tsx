import React from 'react';
import { Bar } from 'recharts';
import {
  BarChart,
  CartesianGrid,
  ResponsiveContainer,
  XAxis,
  YAxis,
  Tooltip,
} from 'recharts';

import { MerchandiseItem, MerchandiseMetric } from '../../types/merchandise';

import formatCurrency from '@/utils/formatCurrency';

interface MerchandiseChartProps {
  data: MerchandiseItem[];
  metric: MerchandiseMetric;
}

export const MerchandiseChart: React.FC<MerchandiseChartProps> = ({ 
  data,
  metric
}) => {
  const formatValue = (value: number) => {
    if (metric === 'revenue') {
      return formatCurrency(value);
    }
    return value.toString();
  };

  return (
    <ResponsiveContainer width="100%" height={600}>
      <BarChart
        data={data}
        layout="vertical"
        margin={{ top: 0, right: 0, left: 0, bottom: 0 }}
      >
        <CartesianGrid strokeDasharray="3 3" horizontal={false} />
        <XAxis type="number" tickFormatter={(value) => {
          if (metric === 'revenue') {
            return `${(value / 1000000).toFixed(0)}tr`;
          }
          return value.toString();
        }} />
        <YAxis 
          type="category" 
          dataKey="name" 
          width={150}
          tick={{ fontSize: 12 }}
        />
        <Tooltip 
          formatter={(value: number) => [formatValue(value), metric === 'revenue' ? 'Doanh thu' : 'Số lượng']}
        />
        <Bar 
          dataKey="value" 
          fill="hsl(var(--primary))"
          radius={[0, 4, 4, 0]}
        />
      </BarChart>
    </ResponsiveContainer>
  );
}; 