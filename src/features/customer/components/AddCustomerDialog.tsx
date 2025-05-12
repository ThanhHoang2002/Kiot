import { useMutation, useQueryClient } from '@tanstack/react-query';
import { Plus } from 'lucide-react';
import { useState } from 'react';

import { CustomerForm, CustomerFormValues } from './CustomerForm';
import { createCustomer } from '../api/customerApi';

import { Button } from '@/components/ui/button';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog';
import { useToast } from '@/hooks/use-toast';

export const AddCustomerDialog = () => {
  const [open, setOpen] = useState(false);
  const { toast } = useToast();
  const queryClient = useQueryClient();

  const { mutate, isPending } = useMutation({
    mutationFn: createCustomer,
    onSuccess: () => {
      toast({
        title: 'Thêm khách hàng thành công',
        description: 'Khách hàng mới đã được thêm vào hệ thống',
      });
      queryClient.invalidateQueries({ queryKey: ['customers'] });
      setOpen(false);
    },
    onError: (error) => {
      toast({
        title: 'Thêm khách hàng thất bại',
        description: error instanceof Error ? error.message : 'Đã có lỗi xảy ra',
        variant: 'destructive',
      });
    },
  });

  const handleSubmit = (data: CustomerFormValues) => {
    mutate(data);
  };

  const handleOpenDialog = (e: React.MouseEvent) => {
    e.stopPropagation();
    // Đóng tất cả các menu, popover đang mở
    // Đây là một cách "hack" để đảm bảo không có component UI nào khác đang mở
    document.body.click();
    setOpen(true);
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button 
          size="sm" 
          className="bg-[#00B63E] hover:bg-green-700"
          onClick={handleOpenDialog}
        >
          <Plus className="mr-2 h-4 w-4" />
          Thêm khách hàng
        </Button>
      </DialogTrigger>
      <DialogContent 
        className="sm:max-w-[425px]"
        onPointerDownOutside={(e) => {
          // Ngăn chặn việc click vào bên ngoài dialog gây ra sự kiện cho các component khác
          e.preventDefault();
        }}
      >
        <DialogHeader>
          <DialogTitle>Thêm khách hàng mới</DialogTitle>
          <DialogDescription>
            Điền thông tin khách hàng vào biểu mẫu bên dưới
          </DialogDescription>
        </DialogHeader>
        <CustomerForm onSubmit={handleSubmit} isLoading={isPending} />
      </DialogContent>
    </Dialog>
  );
}; 