import { format, parseISO } from 'date-fns';

import { Customer } from '../types/customer';

import { Badge } from '@/components/ui/badge';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';

interface ViewCustomerDialogProps {
  customer: Customer;
  isOpen: boolean;
  onClose: () => void;
}

export const ViewCustomerDialog = ({ customer, isOpen, onClose }: ViewCustomerDialogProps) => {
  const formatDate = (dateString: string | null) => {
    if (!dateString) return 'N/A';
    try {
      return format(parseISO(dateString), 'dd/MM/yyyy HH:mm');
    } catch {
      return dateString;
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>Thông tin khách hàng</DialogTitle>
          <DialogDescription>
            Chi tiết thông tin của khách hàng
          </DialogDescription>
        </DialogHeader>

        <div className="grid gap-4 py-4">
          <div className="grid grid-cols-3 items-center gap-4">
            <div className="font-medium">ID:</div>
            <div className="col-span-2">{customer.id}</div>
          </div>
          
          <div className="grid grid-cols-3 items-center gap-4">
            <div className="font-medium">Họ tên:</div>
            <div className="col-span-2">{customer.fullname}</div>
          </div>
          
          <div className="grid grid-cols-3 items-center gap-4">
            <div className="font-medium">Số điện thoại:</div>
            <div className="col-span-2">
              <a href={`tel:${customer.phone}`} className="text-blue-600 hover:underline">
                {customer.phone}
              </a>
            </div>
          </div>
          
          <div className="grid grid-cols-3 items-center gap-4">
            <div className="font-medium">Điểm tích lũy:</div>
            <div className="col-span-2">{customer.point}</div>
          </div>
          
          <div className="grid grid-cols-3 items-center gap-4">
            <div className="font-medium">Trạng thái:</div>
            <div className="col-span-2">
              <Badge variant={customer.active ? "default" : "destructive"}>
                {customer.active ? "Hoạt động" : "Vô hiệu hóa"}
              </Badge>
            </div>
          </div>
          
          <div className="grid grid-cols-3 items-center gap-4">
            <div className="font-medium">Ngày tạo:</div>
            <div className="col-span-2">{formatDate(customer.createdAt)}</div>
          </div>
          
          <div className="grid grid-cols-3 items-center gap-4">
            <div className="font-medium">Ngày cập nhật:</div>
            <div className="col-span-2">{formatDate(customer.updatedAt)}</div>
          </div>
          
          <div className="grid grid-cols-3 items-center gap-4">
            <div className="font-medium">Người tạo:</div>
            <div className="col-span-2">{customer.createdBy}</div>
          </div>
          
          <div className="grid grid-cols-3 items-center gap-4">
            <div className="font-medium">Người cập nhật:</div>
            <div className="col-span-2">{customer.updatedBy || 'N/A'}</div>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}; 