import { format, subMonths } from 'date-fns';
import { vi } from 'date-fns/locale';
import { CalendarIcon } from 'lucide-react';
import React, { useState } from 'react';

import { useRevenueStore } from '../../stores/revenueStore';

import { Button } from '@/components/ui/button';
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from '@/components/ui/popover';
import { cn } from '@/utils/cn';

export const MonthPicker: React.FC = () => {
  const { month, setMonth } = useRevenueStore();
  const [popoverOpen, setPopoverOpen] = useState(false);
  const currentDate = new Date(month + '-01');
  const today = new Date();
  
  // Tạo danh sách 12 tháng gần nhất
  const months = Array.from({ length: 12 }, (_, i) => {
    const date = subMonths(today, i);
    return {
      value: format(date, 'yyyy-MM'),
      label: format(date, 'MMMM yyyy', { locale: vi })
    };
  });

  return (
    <Popover open={popoverOpen} onOpenChange={setPopoverOpen}>
      <PopoverTrigger asChild>
        <Button
          variant="outline"
          className="justify-start text-left font-normal"
        >
          <CalendarIcon className="mr-2 h-4 w-4" />
          {format(currentDate, 'MMMM yyyy', { locale: vi })}
        </Button>
      </PopoverTrigger>
      <PopoverContent className="w-[200px] p-0" align="start">
        <div className="grid grid-cols-1 gap-1 p-2">
          {months.map((item) => (
            <Button
              key={item.value}
              variant="ghost"
              className={cn(
                'justify-start font-normal',
                item.value === month && 'bg-accent text-accent-foreground'
              )}
              onClick={() => {
                setMonth(item.value);
                setPopoverOpen(false);
              }}
            >
              {item.label}
            </Button>
          ))}
        </div>
      </PopoverContent>
    </Popover>
  );
}; 