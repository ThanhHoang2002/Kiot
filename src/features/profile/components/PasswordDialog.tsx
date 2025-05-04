import { zodResolver } from '@hookform/resolvers/zod';
import { Loader2 } from 'lucide-react';
import { useForm } from 'react-hook-form';
import { z } from 'zod';

import { Button } from '@/components/ui/button';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { FormField } from '@/components/ui/form-field';

// Schema cho form đổi mật khẩu
const passwordSchema = z.object({
  currentPassword: z.string().min(6, { message: 'Mật khẩu hiện tại phải có ít nhất 6 ký tự' }),
  newPassword: z.string().min(6, { message: 'Mật khẩu mới phải có ít nhất 6 ký tự' }),
  confirmPassword: z.string().min(6, { message: 'Xác nhận mật khẩu phải có ít nhất 6 ký tự' }),
}).refine((data) => data.newPassword === data.confirmPassword, {
  message: "Mật khẩu xác nhận không khớp với mật khẩu mới",
  path: ["confirmPassword"],
});

export type PasswordFormValues = z.infer<typeof passwordSchema>;

interface PasswordDialogProps {
  isOpen: boolean;
  isSubmitting: boolean;
  onOpenChange: (open: boolean) => void;
  onSubmit: (data: PasswordFormValues) => void;
}

export const PasswordDialog = ({
  isOpen,
  isSubmitting,
  onOpenChange,
  onSubmit,
}: PasswordDialogProps) => {
  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm<PasswordFormValues>({
    resolver: zodResolver(passwordSchema),
  });

  const handleFormSubmit = (data: PasswordFormValues) => {
    onSubmit(data);
    // Không reset form ở đây vì chúng ta muốn đợi API call thành công
  };

  // Đóng dialog khi submit thành công
  const handleOpenChange = (open: boolean) => {
    onOpenChange(open);
    if (!open) {
      setTimeout(() => reset(), 200); // Đợi animation đóng hoàn tất
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={handleOpenChange}>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>Đổi mật khẩu</DialogTitle>
          <DialogDescription>
            Nhập mật khẩu hiện tại và mật khẩu mới để thay đổi
          </DialogDescription>
        </DialogHeader>
        <form onSubmit={handleSubmit(handleFormSubmit)} className="space-y-4">
          <FormField
            id="currentPassword"
            label="Mật khẩu hiện tại"
            type="password"
            placeholder="Nhập mật khẩu hiện tại"
            error={errors.currentPassword}
            disabled={isSubmitting}
            registration={register('currentPassword')}
          />
          <FormField
            id="newPassword"
            label="Mật khẩu mới"
            type="password"
            placeholder="Nhập mật khẩu mới"
            error={errors.newPassword}
            disabled={isSubmitting}
            registration={register('newPassword')}
          />
          <FormField
            id="confirmPassword"
            label="Xác nhận mật khẩu mới"
            type="password"
            placeholder="Nhập lại mật khẩu mới"
            error={errors.confirmPassword}
            disabled={isSubmitting}
            registration={register('confirmPassword')}
          />
          <DialogFooter>
            <Button 
              type="button" 
              variant="outline" 
              onClick={() => handleOpenChange(false)} 
              disabled={isSubmitting}
            >
              Hủy
            </Button>
            <Button type="submit" disabled={isSubmitting} className="flex items-center gap-2">
              {isSubmitting && <Loader2 className="h-4 w-4 animate-spin" />}
              {isSubmitting ? 'Đang xử lý...' : 'Đổi mật khẩu'}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}; 