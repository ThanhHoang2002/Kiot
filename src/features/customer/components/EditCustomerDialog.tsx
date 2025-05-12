import { useMutation, useQueryClient } from '@tanstack/react-query';

import { CustomerForm, CustomerFormValues } from './CustomerForm';
import { updateCustomer } from '../api/customerApi';
import { Customer } from '../types/customer';

import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { useToast } from '@/hooks/use-toast';

interface EditCustomerDialogProps {
  customer: Customer;
  isOpen: boolean;
  onClose: () => void;
}

export const EditCustomerDialog = ({ customer, isOpen, onClose }: EditCustomerDialogProps) => {
  const { toast } = useToast();
  const queryClient = useQueryClient();

  const { mutate, isPending } = useMutation({
    mutationFn: (values: CustomerFormValues) => updateCustomer(customer.id, values),
    onSuccess: () => {
      toast({
        title: 'Cập nhật thành công',
        description: 'Thông tin khách hàng đã được cập nhật',
      });
      queryClient.invalidateQueries({ queryKey: ['customers'] });
      onClose();
    },
    onError: (error) => {
      toast({
        title: 'Cập nhật thất bại',
        description: error instanceof Error ? error.message : 'Đã có lỗi xảy ra',
        variant: 'destructive',
      });
    },
  });

  const handleSubmit = (data: CustomerFormValues) => {
    mutate(data);
  };

  const handleOpenChange = (open: boolean) => {
    if (!open) {
      onClose();
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={handleOpenChange}>
      <DialogContent 
        className="sm:max-w-[425px]"
        onPointerDownOutside={(e) => {
          e.preventDefault();
        }}
      >
        <DialogHeader>
          <DialogTitle>Chỉnh sửa khách hàng</DialogTitle>
          <DialogDescription>
            Chỉnh sửa thông tin khách hàng. Nhấn Lưu khi hoàn tất.
          </DialogDescription>
        </DialogHeader>
        <CustomerForm 
          initialData={customer} 
          onSubmit={handleSubmit} 
          isLoading={isPending} 
        />
      </DialogContent>
    </Dialog>
  );
}; 