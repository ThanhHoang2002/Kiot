import React from 'react';

import { useRevenueStore } from '../../stores/revenueStore';
import { RevenueTimeframe } from '../../types/revenue';

import { Tabs, TabsList, TabsTrigger } from '@/components/ui/tabs';

const timeframeOptions: { value: RevenueTimeframe; label: string }[] = [
  { value: 'daily', label: 'Theo ngày' },
  { value: 'hourly', label: 'Theo giờ' },
  { value: 'weekly', label: 'Theo tuần' }
];

export const RevenueTabs: React.FC = () => {
  const { timeframe, setTimeframe } = useRevenueStore();

  return (
    <Tabs value={timeframe} onValueChange={(value) => setTimeframe(value as RevenueTimeframe)}>
      <TabsList className="flex h-auto items-center justify-start bg-transparent p-0">
        {timeframeOptions.map((option, index) => (
          <React.Fragment key={option.value}>
            {index > 0 && <span className="mx-3 h-1 w-1 rounded-full bg-gray-300" />}
            <TabsTrigger 
              value={option.value}
              className="relative bg-transparent px-1 py-1.5 after:absolute after:bottom-0 after:left-0 after:right-0 after:h-0.5 after:scale-x-0 after:transform after:bg-primary after:transition-transform data-[state=active]:shadow-none data-[state=active]:after:scale-x-100"
            >
              {option.label}
            </TabsTrigger>
          </React.Fragment>
        ))}
      </TabsList>
    </Tabs>
  );
}; 