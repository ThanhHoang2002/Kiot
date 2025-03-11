import React from 'react';

import { Card } from '@/components/ui/card';
import { Skeleton } from '@/components/ui/skeleton';

export const TodayStatisticsSkeleton: React.FC = () => (
  <Card className="p-4">
    <Skeleton className="mb-4 h-7 w-48" />
    <div className="grid grid-cols-4 gap-8">
      {[...Array(4)].map((_, i) => (
        <div key={i} className="flex flex-col">
          <div className="flex items-center gap-2">
            <Skeleton className="h-6 w-6 rounded-full" />
            <Skeleton className="h-6 w-24" />
          </div>
          <div className="mt-1">
            <Skeleton className="mt-1 h-3 w-20" />
          </div>
        </div>
      ))}
    </div>
  </Card>
); 