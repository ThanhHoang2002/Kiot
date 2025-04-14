import { useQuery } from '@tanstack/react-query';
import { memo } from 'react';

import { MerchandiseChart } from './MerchandiseChart';
import { fetchMerchandiseData } from '../../api/merchandiseApi';
import { useMerchandiseStore } from '../../stores/merchandiseStore';

import { Card } from '@/components/ui/card';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { Skeleton } from '@/components/ui/skeleton';

const timeframeOptions = [
  { value: 'today', label: 'Hôm nay' },
  { value: 'week', label: 'Tuần này' },
  { value: 'month', label: 'Tháng này' },
  { value: 'year', label: 'Năm nay' },
];

const metricOptions = [
  { value: 'revenue', label: 'THEO DOANH THU THUẦN' },
  { value: 'quantity', label: 'THEO SỐ LƯỢNG' },
];

export const MerchandiseSection= memo(() => {
  const { timeframe, metric, setTimeframe, setMetric } = useMerchandiseStore();

  const { data, isLoading } = useQuery({
    queryKey: ['merchandise', timeframe, metric],
    queryFn: () => fetchMerchandiseData(timeframe, metric),
  });

  if (isLoading) {
    return (
      <Card className="p-4">
        <Skeleton className="h-[700px]" />
      </Card>
    );
  }

  if (!data) return null;

  return (
    <Card className="p-4">
      <div className="mb-4 flex items-center justify-between">
        <div className="flex items-center gap-2">
          <h2 className="text-xl font-bold">TOP 10 HÀNG HÓA BÁN CHẠY</h2>
          <Select value={metric} onValueChange={setMetric}>
            <SelectTrigger className="w-[300px]">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              {metricOptions.map(option => (
                <SelectItem key={option.value} value={option.value}>
                  {option.label}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
        <Select value={timeframe} onValueChange={setTimeframe}>
          <SelectTrigger className="w-[150px]">
            <SelectValue />
          </SelectTrigger>
          <SelectContent>
            {timeframeOptions.map(option => (
              <SelectItem key={option.value} value={option.value}>
                {option.label}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>
      <MerchandiseChart data={data.items} metric={data.metric} />
    </Card>
  );
}); 
MerchandiseSection.displayName = 'MerchandiseSection';