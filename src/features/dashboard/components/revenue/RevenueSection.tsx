import { useQuery } from '@tanstack/react-query';
import React from 'react';

import { MonthPicker } from './MonthPicker';
import { RevenueChart } from './RevenueChart';
import { RevenueTabs } from './RevenueTabs';
import { fetchRevenueDetails } from '../../api/revenueApi';
import { useRevenueStore } from '../../stores/revenueStore';
import { calculateTotal } from '../../utils/revenueUtils';

import { nextIcon } from '@/assets/icon';
import { Card } from '@/components/ui/card';
import formatCurrency from '@/utils/formatCurrency';


export const RevenueSection: React.FC = () => {
  const { month, timeframe } = useRevenueStore();

  const { data } = useQuery({
    queryKey: ['revenue', month, timeframe],
    queryFn: () => fetchRevenueDetails(month, timeframe),
  });

  const totalRevenue = data ? calculateTotal(data.data) : 0;
  return (
    <Card className="space-y-4 p-4">   
      <div className='flex items-center justify-between'>
        <div className='flex items-center space-x-3'>
          <div className="text-xl font-bold uppercase">
            Tổng doanh thu thuần
          </div>
          <div className="flex space-x-1 text-xl font-bold text-primary ">  
            <img src={nextIcon} alt="next" className='w-4' />
           <p> {formatCurrency(totalRevenue)}</p>
          </div>
        </div>
        <MonthPicker />
      </div>
      <RevenueTabs />
      <RevenueChart />
    </Card>
  );
}; 