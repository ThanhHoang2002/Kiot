import { format, parseISO } from 'date-fns';
import { FileText } from 'lucide-react';
import { useState, useEffect } from 'react';

import { exportInvoicePdf } from '../api/invoice';
import { Invoice, PaymentMethod, PaymentStatus } from '../types/invoice';

import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogPortal,
  DialogOverlay,
} from '@/components/ui/dialog';
import { Separator } from '@/components/ui/separator';
import { Skeleton } from '@/components/ui/skeleton';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { useToast } from '@/hooks/use-toast';

interface InvoiceDetailDialogProps {
  invoice: Invoice;
  isOpen: boolean;
  onClose: () => void;
}

export const InvoiceDetailDialog = ({ invoice, isOpen, onClose }: InvoiceDetailDialogProps) => {
  const [isExporting, setIsExporting] = useState(false);
  const { toast } = useToast();

  // Reset body style when component unmounts or dialog closes
  useEffect(() => {
    // Cleanup function
    return () => {
      // Ensure body is restored to default state
      document.body.style.pointerEvents = '';
    };
  }, []);

  // Reset pointer-events when dialog closes
  useEffect(() => {
    if (!isOpen) {
      // Small timeout to ensure proper cleanup after animation
      const timer = setTimeout(() => {
        document.body.style.pointerEvents = '';
      }, 100);
      
      return () => clearTimeout(timer);
    }
  }, [isOpen]);

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('vi-VN', { style: 'currency', currency: 'VND' }).format(amount);
  };

  const formatDate = (dateString: string | null) => {
    if (!dateString) return 'N/A';
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

  // Hàm xuất hóa đơn PDF
  const handleExportPdf = async () => {
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
  };

  const handleOpenChange = (open: boolean) => {
    if (!open) {
      // Small delay to ensure any previous interaction is completed
      setTimeout(() => {
        onClose();
        // Force reset pointer-events on body
        document.body.style.pointerEvents = '';
      }, 10);
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={handleOpenChange} modal={true}>
      <DialogPortal forceMount>
        <DialogOverlay className="z-[60]" />
        <DialogContent 
          className="z-[70] max-w-3xl" 
          onEscapeKeyDown={(e) => {
            // Prevent event propagation to ensure clean close
            e.stopPropagation();
            handleOpenChange(false);
          }}
          onPointerDownOutside={(e) => {
            // Prevent event propagation to ensure clean close
            e.stopPropagation();
            handleOpenChange(false);
          }}
          onInteractOutside={(e) => {
            // Prevent event propagation to ensure clean close
            e.stopPropagation();
            e.preventDefault();
          }}
        >
          <DialogHeader>
            <DialogTitle>Chi tiết hóa đơn #{invoice.id}</DialogTitle>
            <DialogDescription>
              Thông tin chi tiết của hóa đơn
            </DialogDescription>
          </DialogHeader>

          <div className="mt-4 grid grid-cols-1 gap-6 md:grid-cols-2">
            <div>
              <h3 className="font-medium">Thông tin hóa đơn</h3>
              <div className="mt-2 space-y-2 rounded-md border p-4">
                <div className="flex justify-between">
                  <span className="text-sm text-muted-foreground">Mã hóa đơn:</span>
                  <span className="font-medium">#{invoice.id}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-sm text-muted-foreground">Ngày tạo:</span>
                  <span>{formatDate(invoice.createdAt)}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-sm text-muted-foreground">Trạng thái:</span>
                  <Badge variant={getPaymentStatusConfig(invoice.paymentStatus).variant}>
                    {getPaymentStatusConfig(invoice.paymentStatus).label}
                  </Badge>
                </div>
                <div className="flex justify-between">
                  <span className="text-sm text-muted-foreground">Phương thức:</span>
                  <span>{getPaymentMethodLabel(invoice.paymentMethod)}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-sm text-muted-foreground">Tổng tiền:</span>
                  <span className="font-medium text-green-600">
                    {formatCurrency(invoice.totalPrice)}
                  </span>
                </div>
              </div>
            </div>

            <div>
              <h3 className="font-medium">Thông tin khách hàng</h3>
              <div className="mt-2 space-y-2 rounded-md border p-4">
                {invoice.customer ? (
                  <>
                    <div className="flex justify-between">
                      <span className="text-sm text-muted-foreground">Tên khách hàng:</span>
                      <span className="font-medium">{invoice.customer.fullname}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-sm text-muted-foreground">Số điện thoại:</span>
                      <a href={`tel:${invoice.customer.phone}`} className="text-blue-600 hover:underline">
                        {invoice.customer.phone}
                      </a>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-sm text-muted-foreground">Điểm tích lũy:</span>
                      <span>{invoice.customer.point}</span>
                    </div>
                  </>
                ) : (
                  <div className="py-4 text-center text-muted-foreground">
                    Khách lẻ
                  </div>
                )}
              </div>
            </div>
          </div>

          <Separator className="my-4" />

          <div>
            <h3 className="mb-4 font-medium">Chi tiết sản phẩm</h3>
            <div className="rounded-md border">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>STT</TableHead>
                    <TableHead>Tên sản phẩm</TableHead>
                    <TableHead className="text-right">Số lượng</TableHead>
                    <TableHead className="text-right">Đơn giá</TableHead>
                    <TableHead className="text-right">Thành tiền</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {invoice.items && invoice.items.length > 0 ? (
                    invoice.items.map((item, index) => (
                      <TableRow key={item.id}>
                        <TableCell>{index + 1}</TableCell>
                        <TableCell className="font-medium">{item.name}</TableCell>
                        <TableCell className="text-right">{item.quantity}</TableCell>
                        <TableCell className="text-right">{formatCurrency(item.price)}</TableCell>
                        <TableCell className="text-right">{formatCurrency(item.total)}</TableCell>
                      </TableRow>
                    ))
                  ) : (
                    <TableRow>
                      <TableCell colSpan={5} className="py-8 text-center text-muted-foreground">
                        <span>Không có dữ liệu chi tiết sản phẩm</span>
                      </TableCell>
                    </TableRow>
                  )}
                  
                  {/* Tổng tiền */}
                  {invoice.items && invoice.items.length > 0 && (
                    <TableRow className="border-t-2">
                      <TableCell colSpan={4} className="text-right font-medium">
                        Tổng tiền:
                      </TableCell>
                      <TableCell className="text-right font-medium text-green-600">
                        {formatCurrency(invoice.totalPrice)}
                      </TableCell>
                    </TableRow>
                  )}
                </TableBody>
              </Table>
            </div>
          </div>

          <div className="mt-6 flex justify-between gap-2">
            <Button 
              variant="outline" 
              onClick={() => {
                handleOpenChange(false);
              }}
            >
              Đóng
            </Button>
            <div className="flex gap-2">
              <Button onClick={handleExportPdf} disabled={isExporting}>
                {isExporting ? (
                  <Skeleton className="mr-2 h-4 w-4 rounded-full" />
                ) : (
                  <FileText className="mr-2 h-4 w-4" />
                )}
                Xuất PDF
              </Button>
            </div>
          </div>
        </DialogContent>
      </DialogPortal>
    </Dialog>
  );
}; 