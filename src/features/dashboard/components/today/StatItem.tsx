import { ArrowDownIcon, ArrowUpIcon, CircleDollarSignIcon, FileTextIcon } from 'lucide-react';
import React from 'react';

import { TrendType } from '../../types/statistics';

interface StatItemProps {
  label: string;
  value?: string | number;
  percentage?: number;
  trend?: TrendType;
  type: 'revenue' | 'orders' | 'compare';
  sublabel?: string;
}

export const StatItem: React.FC<StatItemProps> = ({ 
  label, 
  value, 
  percentage, 
  trend,
  type,
  sublabel = 'Doanh thu' // Default sublabel
}) => {

  const getIconBackground = (type: string) => {
    switch (type) {
      case 'revenue':
        return 'bg-blue-100';
      case 'orders':
        return 'bg-orange-100';
      case 'compare':
        return trend === 'up' ? 'bg-green-100' : 'bg-red-100';
    }
  };

  const getIconColor = (type: string) => {
    switch (type) {
      case 'revenue':
        return 'text-blue-500';
      case 'orders':
        return 'text-orange-500';
      case 'compare':
        return trend === 'up' ? 'text-green-500' : 'text-red-500';
    }
  };

  const renderIcon = () => {
    const iconClass = `h-4 w-4 ${getIconColor(type)}`;
    switch (type) {
      case 'revenue':
        return <CircleDollarSignIcon className={iconClass} />;
      case 'orders':
        return <FileTextIcon className={iconClass} />;
      case 'compare':
        return trend === 'up' ? (
          <ArrowUpIcon className={iconClass} />
        ) : (
          <ArrowDownIcon className={iconClass} />
        );
    }
  };

  return (
    <div className="flex flex-col">
      <div className="flex items-center gap-2">
        <div className={`flex h-6 w-6 items-center justify-center rounded-full ${getIconBackground(type)}`}>
          {renderIcon()}
        </div>
        <span className="font-medium">{label}</span>
      </div>
      <div className="mt-1">
        {value && (
          <div className="text-xl font-bold">{value}</div>
        )}
        {percentage !== undefined && (
          <div className="text-xl font-bold">
            {trend === 'up' ? '+' : ''}{percentage.toFixed(2)}%
          </div>
        )}
        {sublabel && (
          <div className="text-xs text-gray-500">{sublabel}</div>
        )}
      </div>
    </div>
  );
}; 