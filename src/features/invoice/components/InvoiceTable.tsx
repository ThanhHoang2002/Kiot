import { format, parseISO } from 'date-fns';
import { Eye } from 'lucide-react';
import { memo } from 'react';

import { Invoice, PaymentMethod, PaymentStatus } from '../types/invoice';

import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Skeleton } from '@/components/ui/skeleton';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';

type Props = {
  invoices: Invoice[];
  onViewDetails: (id: number) => void;
  isLoading?: boolean;
};

const formatCurrency = (amount: number) => {
  return new Intl.NumberFormat('vi-VN', { style: 'currency', currency: 'VND' }).format(amount);
};

const formatDate = (dateString: string) => {
  try {
    return format(parseISO(dateString), 'dd/MM/yyyy HH:mm');
  } catch {
    return dateString;
  }
};

const getPaymentMethodLabel = (method: PaymentMethod) => {
  switch (method) {
    case 'CASH':
      return 'Tiền mặt';
    case 'TRANSFER':
      return 'Chuyển khoản';
    default:
      return method;
  }
};

const getPaymentStatusConfig = (status: PaymentStatus) => {
  switch (status) {
    case 'PENDING':
      return { label: 'Đang xử lý', variant: 'secondary' as const };
    case 'COMPLETED':
      return { label: 'Hoàn thành', variant: 'default' as const };
    case 'FAILED':
      return { label: 'Thất bại', variant: 'destructive' as const };
    default:
      return { label: status, variant: 'outline' as const };
  }
};

// Memoized row component để tối ưu render
const InvoiceRow = memo(({ invoice, onViewDetails }: { invoice: Invoice, onViewDetails: (id: number) => void }) => {
  return (
    <TableRow>
      <TableCell className="font-medium">{invoice.id}</TableCell>
      <TableCell>{formatCurrency(invoice.totalPrice)}</TableCell>
      <TableCell className="hidden md:table-cell">{getPaymentMethodLabel(invoice.paymentMethod)}</TableCell>
      <TableCell>
        <Badge variant={getPaymentStatusConfig(invoice.paymentStatus).variant}>
          {getPaymentStatusConfig(invoice.paymentStatus).label}
        </Badge>
      </TableCell>
      <TableCell className="hidden lg:table-cell">
        <div className="flex items-center gap-2">
          {invoice.user.avatar && (
            <img 
              src={invoice.user.avatar} 
              alt={invoice.user.name} 
              className="h-6 w-6 rounded-full object-cover"
            />
          )}
          <span className="max-w-[120px] overflow-hidden text-ellipsis whitespace-nowrap">
            {invoice.user.name}
          </span>
        </div>
      </TableCell>
      <TableCell className="hidden lg:table-cell">
        {invoice.customer ? (
          <div>
            <p className="max-w-[120px] overflow-hidden text-ellipsis whitespace-nowrap">
              {invoice.customer.fullname}
            </p>
            <p className="text-xs text-muted-foreground">{invoice.customer.phone}</p>
          </div>
        ) : (
          <span className="text-muted-foreground">N/A</span>
        )}
      </TableCell>
      <TableCell className="hidden md:table-cell">{formatDate(invoice.createdAt)}</TableCell>
      <TableCell className="text-right">
        <Button
          variant="ghost"
          size="icon"
          onClick={() => onViewDetails(invoice.id)}
        >
          <Eye className="h-4 w-4" />
        </Button>
      </TableCell>
    </TableRow>
  );
});

InvoiceRow.displayName = 'InvoiceRow';

// Skeleton row để hiển thị trong khi loading
const SkeletonRow = () => (
  <TableRow>
    <TableCell><Skeleton className="h-5 w-10" /></TableCell>
    <TableCell><Skeleton className="h-5 w-24" /></TableCell>
    <TableCell className="hidden md:table-cell"><Skeleton className="h-5 w-20" /></TableCell>
    <TableCell><Skeleton className="h-6 w-20" /></TableCell>
    <TableCell className="hidden lg:table-cell"><Skeleton className="h-5 w-32" /></TableCell>
    <TableCell className="hidden lg:table-cell"><Skeleton className="h-10 w-32" /></TableCell>
    <TableCell className="hidden md:table-cell"><Skeleton className="h-5 w-32" /></TableCell>
    <TableCell className="text-right"><Skeleton className="h-8 w-8 rounded-full" /></TableCell>
  </TableRow>
);

const InvoiceTable = ({ invoices, onViewDetails, isLoading }: Props) => {
  if (!invoices.length && !isLoading) {
    return (
      <Card>
        <CardContent className="p-6">
          <div className="py-8 text-center">
            <p className="text-muted-foreground">Không có dữ liệu hóa đơn</p>
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card>
      <CardHeader className="pb-1">
        <CardTitle className="text-xl">Danh sách hóa đơn</CardTitle>
        <CardDescription>
          {!isLoading && `Tổng cộng ${invoices.length} hóa đơn`}
        </CardDescription>
      </CardHeader>
      <CardContent className="p-0">
        <div className="overflow-x-auto">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead className="w-[70px]">ID</TableHead>
                <TableHead className="w-[130px]">Tổng tiền</TableHead>
                <TableHead className="hidden md:table-cell">Phương thức</TableHead>
                <TableHead>Trạng thái</TableHead>
                <TableHead className="hidden lg:table-cell">Người tạo</TableHead>
                <TableHead className="hidden lg:table-cell">Khách hàng</TableHead>
                <TableHead className="hidden md:table-cell">Ngày tạo</TableHead>
                <TableHead className="w-[70px] text-right">Thao tác</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {isLoading ? (
                // Hiển thị skeleton rows khi đang loading
                <>
                  <SkeletonRow />
                  <SkeletonRow />
                  <SkeletonRow />
                  <SkeletonRow />
                  <SkeletonRow />
                </>
              ) : (
                // Hiển thị dữ liệu thực khi đã load xong
                invoices.map((invoice) => (
                  <InvoiceRow 
                    key={invoice.id} 
                    invoice={invoice} 
                    onViewDetails={onViewDetails} 
                  />
                ))
              )}
            </TableBody>
          </Table>
        </div>
      </CardContent>
    </Card>
  );
};

export default memo(InvoiceTable); 