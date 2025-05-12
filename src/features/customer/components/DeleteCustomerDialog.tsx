import { useMutation, useQueryClient } from '@tanstack/react-query';

import { deleteCustomer } from '../api/customerApi';

import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from '@/components/ui/alert-dialog';
import { useToast } from '@/hooks/use-toast';

interface DeleteCustomerDialogProps {
  customerId: number;
  customerName: string;
  isOpen: boolean;
  onClose: () => void;
}

export const DeleteCustomerDialog = ({
  customerId,
  customerName,
  isOpen,
  onClose,
}: DeleteCustomerDialogProps) => {
  const { toast } = useToast();
  const queryClient = useQueryClient();

  const { mutate, isPending } = useMutation({
    mutationFn: () => deleteCustomer(customerId),
    onSuccess: () => {
      toast({
        title: 'Xóa khách hàng thành công',
        description: `Khách hàng ${customerName} đã được xóa`,
      });
      queryClient.invalidateQueries({ queryKey: ['customers'] });
      onClose();
    },
    onError: (error) => {
      toast({
        title: 'Xóa khách hàng thất bại',
        description: error instanceof Error ? error.message : 'Đã có lỗi xảy ra',
        variant: 'destructive',
      });
    },
  });

  const handleConfirm = (e: React.MouseEvent) => {
    e.stopPropagation();
    mutate();
  };

  const handleOpenChange = (open: boolean) => {
    if (!open) {
      // Đảm bảo khi đóng dialog, chúng ta gọi onClose để cập nhật state ở component cha
      onClose();
    }
  };

  return (
    <AlertDialog open={isOpen} onOpenChange={handleOpenChange}>
      <AlertDialogContent>
        <AlertDialogHeader>
          <AlertDialogTitle>Xóa khách hàng</AlertDialogTitle>
          <AlertDialogDescription>
            Bạn có chắc chắn muốn xóa khách hàng <strong>{customerName}</strong>? Hành động này không thể hoàn tác.
          </AlertDialogDescription>
        </AlertDialogHeader>
        <AlertDialogFooter>
          <AlertDialogCancel 
            disabled={isPending}
            onClick={(e) => {
              e.stopPropagation();
            }}
          >
            Hủy
          </AlertDialogCancel>
          <AlertDialogAction
            onClick={handleConfirm}
            disabled={isPending}
            className="bg-red-600 hover:bg-red-700"
          >
            {isPending ? 'Đang xử lý...' : 'Xóa khách hàng'}
          </AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
}; 