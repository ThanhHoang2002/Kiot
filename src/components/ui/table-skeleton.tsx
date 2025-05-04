import { motion } from 'motion/react';

import { Skeleton } from '@/components/ui/skeleton';

export interface TableSkeletonProps {
  columns: number;
  rows?: number;
  columnWidths?: string[];
  showHeader?: boolean;
  headerTitles?: string[];
}

export const TableSkeleton = ({
  columns,
  rows = 10,
  columnWidths = [], 
  showHeader = true,
  headerTitles = []
}: TableSkeletonProps) => {
  // Default widths if not provided
  const defaultWidths = ['w-32', 'w-24', 'w-20', 'w-36', 'w-24', 'w-16'];
  
  // Use provided widths or defaults
  const widths = columnWidths.length >= columns 
    ? columnWidths 
    : [...columnWidths, ...defaultWidths.slice(columnWidths.length)].slice(0, columns);
  
  return (
    <motion.div 
      className="space-y-4" 
      initial={{ opacity: 0 }} 
      animate={{ opacity: 1 }} 
      exit={{ opacity: 0 }} 
      transition={{ duration: 0.5 }}
    >
      <div className="overflow-x-auto rounded-lg border">
        <table className="min-w-full divide-y divide-border">
          {showHeader && (
            <thead className="bg-muted/50">
              <tr>
                {Array(columns).fill(null).map((_, index) => (
                  <th 
                    key={index} 
                    className="px-4 py-3.5 text-left text-sm font-semibold text-muted-foreground"
                  >
                    {headerTitles[index] || ''}
                  </th>
                ))}
              </tr>
            </thead>
          )}
          <tbody className="divide-y divide-border bg-background">
            {Array.from({ length: rows }).map((_, rowIndex) => (
              <tr key={rowIndex}>
                {Array(columns).fill(null).map((_, colIndex) => {
                  const isLastColumn = colIndex === columns - 1;
                  return (
                    <td 
                      key={colIndex} 
                      className={`whitespace-nowrap px-4 py-4 ${isLastColumn ? 'text-right' : ''}`}
                    >
                      <Skeleton className={`h-5 ${isLastColumn ? 'ml-auto h-9 w-9' : widths[colIndex]}`} />
                    </td>
                  );
                })}
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </motion.div>
  );
};

export default TableSkeleton; 