import { memo } from 'react';

import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Skeleton } from '@/components/ui/skeleton';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';

const SkeletonRow = () => (
  <TableRow>
    <TableCell><Skeleton className="h-5 w-10" /></TableCell>
    <TableCell><Skeleton className="h-5 w-32" /></TableCell>
    <TableCell><Skeleton className="h-5 w-24" /></TableCell>
    <TableCell><Skeleton className="h-5 w-16" /></TableCell>
    <TableCell><Skeleton className="h-6 w-20" /></TableCell>
    <TableCell><Skeleton className="h-5 w-32" /></TableCell>
    <TableCell><Skeleton className="h-5 w-24" /></TableCell>
    <TableCell className="text-right"><Skeleton className="ml-auto h-8 w-8 rounded-full" /></TableCell>
  </TableRow>
);

export const CustomerTableSkeleton = memo(() => {
  return (
    <Card>
      <CardHeader className="pb-2">
        <CardTitle className="text-xl">Danh sách khách hàng</CardTitle>
        <Skeleton className="h-4 w-32" />
      </CardHeader>
      <CardContent className="px-0 pt-0">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>ID</TableHead>
              <TableHead>Họ tên</TableHead>
              <TableHead>Số điện thoại</TableHead>
              <TableHead>Điểm</TableHead>
              <TableHead>Trạng thái</TableHead>
              <TableHead>Ngày tạo</TableHead>
              <TableHead>Người tạo</TableHead>
              <TableHead className="text-right">Thao tác</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            <SkeletonRow />
            <SkeletonRow />
            <SkeletonRow />
            <SkeletonRow />
            <SkeletonRow />
          </TableBody>
        </Table>
      </CardContent>
    </Card>
  );
});

CustomerTableSkeleton.displayName = 'CustomerTableSkeleton'; 