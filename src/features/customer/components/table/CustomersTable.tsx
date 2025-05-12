import { memo } from 'react';

import { CustomerPagination } from './CustomerPagination';
import { CustomerRow } from './CustomerRow';
import { CustomerTableSkeleton } from './CustomerTableSkeleton';
import { CustomerParams } from '../../types/customer';
import { CustomersResponse } from '../../types/customer';

import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import {
  Table,
  TableBody,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import { cn } from '@/utils/cn';

interface CustomersTableProps {
  data: CustomersResponse;
  isLoading: boolean;
  filters: CustomerParams;
  updateFilters: (filters: Partial<CustomerParams>) => void;
  onView: (id: number) => void;
}

interface Column {
  key: string;
  label: string;
  align: string;
}

const COLUMNS: Column[] = [
  { key: 'id', label: 'ID', align: 'text-left' },
  { key: 'fullname', label: 'Họ tên', align: 'text-left' },
  { key: 'phone', label: 'Số điện thoại', align: 'text-left' },
  { key: 'point', label: 'Điểm tích lũy', align: 'text-left' },
  { key: 'active', label: 'Trạng thái', align: 'text-left' },
  { key: 'createdAt', label: 'Ngày tạo', align: 'text-left' },
  { key: 'createdBy', label: 'Người tạo', align: 'text-left' },
  { key: 'actions', label: 'Thao tác', align: 'text-right' },
];

export const CustomersTable = memo(
  ({ data, isLoading, filters, updateFilters, onView }: CustomersTableProps) => {
    if (isLoading) {
      return <CustomerTableSkeleton />;
    }

    // Nếu không có data hoặc không có khách hàng nào
    if (!data || !data.result || data.result.length === 0) {
      return (
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-xl">Danh sách khách hàng</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex h-32 items-center justify-center">
              <p className="text-center text-muted-foreground">
                Không có khách hàng nào. Vui lòng thêm mới.
              </p>
            </div>
          </CardContent>
        </Card>
      );
    }

    return (
      <Card>
        <CardHeader className="pb-2">
          <CardTitle className="text-xl">Danh sách khách hàng</CardTitle>
          <p className="text-sm text-muted-foreground">
            Tổng cộng {data.meta.total} khách hàng
          </p>
        </CardHeader>
        <CardContent className="px-0 pt-0">
          <Table>
            <TableHeader className="bg-secondary">
              <TableRow>
                {COLUMNS.map((column) => (
                  <TableHead
                    key={column.key}
                    className={cn(
                      column.align,
                      'truncate text-sm font-medium text-muted-foreground'
                    )}
                  >
                    {column.label}
                  </TableHead>
                ))}
              </TableRow>
            </TableHeader>
            <TableBody>
              {data.result.map((customer) => (
                <CustomerRow
                  key={customer.id}
                  customer={customer}
                  onView={onView}
                />
              ))}
            </TableBody>
          </Table>

          <div className="px-4">
            <CustomerPagination
              currentPage={filters.page as number}
              totalPages={data.meta.pages}
              onPageChange={(page) => {
                updateFilters({ page: page });
              }}
              itemsPerPage={filters.size as number}
              totalItems={data.meta.total}
              onItemsPerPageChange={(value) => {
                updateFilters({ size: value, page: 1 });
              }}
            />
          </div>
        </CardContent>
      </Card>
    );
  }
);

CustomersTable.displayName = 'CustomersTable'; 