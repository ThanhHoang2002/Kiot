import { format, parseISO } from 'date-fns';
import { Eye, FileText, MoreVertical } from 'lucide-react';
import { memo, useState } from 'react';

import { exportInvoicePdf } from '../api/invoice';
import { Invoice, PaymentMethod, PaymentStatus } from '../types/invoice';

import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { Skeleton } from '@/components/ui/skeleton';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { useToast } from '@/hooks/use-toast';

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

// Helper function để tải file từ Blob
const downloadFile = (blob: Blob, filename: string) => {
  const url = window.URL.createObjectURL(blob);
  const link = document.createElement('a');
  link.href = url;
  link.setAttribute('download', filename);
  document.body.appendChild(link);
  link.click();
  link.remove();
  window.URL.revokeObjectURL(url);
};

// Memoized row component để tối ưu render
const InvoiceRow = memo(({ invoice, onViewDetails }: { invoice: Invoice, onViewDetails: (id: number) => void }) => {
  const [isExporting, setIsExporting] = useState(false);
  const { toast } = useToast();

  // Hàm xuất hóa đơn PDF
  const handleExportPdf = async (e: React.MouseEvent) => {
    e.stopPropagation();
    try {
      setIsExporting(true);
      const blob = await exportInvoicePdf(invoice.id);
      const filename = `hoa-don-${invoice.id}.pdf`;
      downloadFile(blob, filename);
      toast({
        title: "Xuất hóa đơn thành công",
        description: `Đã tải xuống hóa đơn ${filename}`,
      });
    } catch (error) {
      console.error("Lỗi khi xuất hóa đơn PDF:", error);
      toast({
        title: "Xuất hóa đơn thất bại",
        description: "Không thể xuất hóa đơn sang PDF. Vui lòng thử lại sau.",
        variant: "destructive",
      });
    } finally {
      setIsExporting(false);
    }
  }

  return (
    <TableRow>
      <TableCell className="pl-3 font-medium">{invoice.id}</TableCell>
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
      <TableCell className="pr-3 text-right">
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button
              variant="ghost"
              size="icon"
              disabled={isExporting}
            >
              {isExporting ? (
                <Skeleton className="h-4 w-4 rounded-full" />
              ) : (
                <MoreVertical className="h-4 w-4" />
              )}
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end">
            <DropdownMenuLabel>Thao tác hóa đơn</DropdownMenuLabel>
            <DropdownMenuSeparator />
            <DropdownMenuItem onClick={() => onViewDetails(invoice.id)}>
              <Eye className="mr-2 h-4 w-4" />
              <span>Xem chi tiết</span>
            </DropdownMenuItem>
            <DropdownMenuItem onClick={handleExportPdf}>
              <FileText className="mr-2 h-4 w-4" />
              <span>Xuất PDF</span>
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
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
      <CardContent className="px-0 py-4">
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
                <TableHead className="w-[70px] truncate text-right">Thao tác</TableHead>
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