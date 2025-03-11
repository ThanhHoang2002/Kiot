import { Skeleton } from '@/components/ui/skeleton';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';

const COLUMNS = [
  { key: 'code', width: 'w-[100px]' },
  { key: 'name', width: 'w-[200px]' },
  { key: 'sellPrice', width: 'w-[100px]' },
  { key: 'costPrice', width: 'w-[100px]' },
  { key: 'quantity', width: 'w-[80px]' },
  { key: 'status', width: 'w-[100px]' },
  { key: 'createdAt', width: 'w-[150px]' },
  { key: 'category', width: 'w-[150px]' },
];

export const ProductTableSkeleton = () => {
  return (
    <div className="space-y-4">
      {/* Table Skeleton */}
      <Table>
        <TableHeader className="bg-secondary">
          <TableRow>
            <TableHead className="w-12">
              <Skeleton className="h-4 w-4" />
            </TableHead>
            {COLUMNS.map((column) => (
              <TableHead key={column.key}>
                <Skeleton className={`h-4 ${column.width}`} />
              </TableHead>
            ))}
          </TableRow>
        </TableHeader>
        <TableBody>
          {Array.from({ length: 10 }).map((_, index) => (
            <TableRow key={index}>
              <TableCell>
                <Skeleton className="h-4 w-4" />
              </TableCell>
              <TableCell className="flex items-center gap-2">
                <Skeleton className="h-10 w-10 rounded" />
                <Skeleton className="h-4 w-[80px]" />
              </TableCell>
              {COLUMNS.slice(1).map((column, colIndex) => (
                <TableCell key={colIndex}>
                  <Skeleton className={`h-4 ${column.width}`} />
                </TableCell>
              ))}
            </TableRow>
          ))}
        </TableBody>
      </Table>
      {/* Pagination Skeleton */}
      <div className="ml-14 flex items-center gap-2">
        {Array.from({ length: 5 }).map((_, index) => (
          <Skeleton key={index} className="h-5 w-5 rounded" />
        ))}
      </div>

    </div>
  );
}; 