import { zodResolver } from '@hookform/resolvers/zod';
import { Loader2 } from 'lucide-react';
import { useEffect, useState } from 'react';
import { useForm } from 'react-hook-form';
import { z } from 'zod';

import { User } from '../types';

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

// Định nghĩa schema cho form chỉnh sửa
const editUserSchema = z.object({
  name: z.string().min(2, { message: 'Tên phải có ít nhất 2 ký tự' }),
  username: z.string().min(3, { message: 'Username phải có ít nhất 3 ký tự' }),
  gender: z.enum(['MALE', 'FEMALE', 'OTHER'], {
    errorMap: () => ({ message: 'Vui lòng chọn giới tính' })
  }),
  address: z.string().min(2, { message: 'Địa chỉ phải có ít nhất 2 ký tự' }),
  roleId: z.number({ 
    required_error: 'Vui lòng chọn vai trò',
    invalid_type_error: 'Vai trò phải là một số' 
  }),
});

type EditUserFormValues = z.infer<typeof editUserSchema>;

interface EditUserDialogProps {
  user: User;
  isOpen: boolean;
  onClose: () => void;
  onUpdate: (data: Partial<User>) => Promise<void>;
  isUpdating: boolean;
}

const EditUserDialog = ({ user, isOpen, onClose, onUpdate, isUpdating }: EditUserDialogProps) => {
  // Local state để kiểm soát việc hiển thị dialog
  const [internalOpen, setInternalOpen] = useState(false);
  
  // Đồng bộ state bên ngoài với state bên trong
  useEffect(() => {
    setInternalOpen(isOpen);
  }, [isOpen]);
  
  const {
    register,
    handleSubmit,
    reset,
    formState: { errors, isSubmitting },
  } = useForm<EditUserFormValues>({
    resolver: zodResolver(editUserSchema),
    defaultValues: {
      name: user.name,
      username: user.username,
      gender: user.gender,
      address: user.address,
      roleId: user.role.id,
    },
  });

  // Reset form khi user thay đổi
  useEffect(() => {
    if (user) {
      reset({
        name: user.name,
        username: user.username,
        gender: user.gender,
        address: user.address,
        roleId: user.role.id,
      });
    }
  }, [user, reset]);

  const onSubmit = async (data: EditUserFormValues) => {
    await onUpdate(data);
  };

  const isLoading = isSubmitting || isUpdating;
  
  // Xử lý khi dialog đóng
  const handleOpenChange = (open: boolean) => {
    if (!open) {
      // Khi dialog đóng, cập nhật state bên trong trước
      setInternalOpen(false);
      
      // Nếu đang loading, không cho phép đóng
      if (isLoading) return;
      
      // Gọi hàm onClose từ props
      onClose();
    } else {
      setInternalOpen(true);
    }
  };

  return (
    <Dialog 
      open={internalOpen} 
      onOpenChange={handleOpenChange}
    >
      <DialogContent className="sm:max-w-[550px]">
        <DialogHeader>
          <DialogTitle>Chỉnh sửa người dùng</DialogTitle>
          <DialogDescription>
            Cập nhật thông tin người dùng {user.name}
          </DialogDescription>
        </DialogHeader>

        <form onSubmit={handleSubmit(onSubmit)} className="grid grid-cols-1 gap-4 py-2 md:grid-cols-2">
          {/* Họ tên */}
          <FormField
            id="name"
            label="Họ tên"
            placeholder="Nhập họ tên"
            error={errors.name}
            disabled={isLoading}
            registration={register('name')}
          />

          {/* Tên đăng nhập */}
          <FormField
            id="username"
            label="Tên đăng nhập"
            placeholder="Nhập tên đăng nhập"
            error={errors.username}
            disabled={isLoading}
            registration={register('username')}
          />

          {/* Giới tính */}
          <div className="space-y-2">
            <label htmlFor="gender" className="text-sm font-medium">Giới tính</label>
            <select
              id="gender"
              className="w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2"
              disabled={isLoading}
              {...register('gender')}
            >
              <option value="MALE">Nam</option>
              <option value="FEMALE">Nữ</option>
              <option value="OTHER">Khác</option>
            </select>
            {errors.gender && (
              <p className="text-xs text-red-500">{errors.gender.message}</p>
            )}
          </div>

          {/* Địa chỉ */}
          <FormField
            id="address"
            label="Địa chỉ"
            placeholder="Nhập địa chỉ"
            error={errors.address}
            disabled={isLoading}
            registration={register('address')}
          />

          {/* Vai trò (roleId) */}
          <div className="space-y-2">
            <label htmlFor="roleId" className="text-sm font-medium">Vai trò</label>
            <select
              id="roleId"
              className="w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2"
              disabled={isLoading}
              {...register('roleId', { valueAsNumber: true })}
            >
              <option value="1">Quản trị viên</option>
              <option value="2">Nhân viên</option>
            </select>
            {errors.roleId && (
              <p className="text-xs text-red-500">{errors.roleId.message}</p>
            )}
          </div>

          <DialogFooter className="col-span-1 mt-6 md:col-span-2">
            <Button 
              type="button" 
              variant="outline" 
              onClick={() => handleOpenChange(false)} 
              disabled={isLoading}
            >
              Hủy
            </Button>
            <Button type="submit" disabled={isLoading} className="flex items-center gap-2">
              {isLoading && <Loader2 className="h-4 w-4 animate-spin" />}
              {isLoading ? 'Đang xử lý...' : 'Cập nhật'}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
};

export default EditUserDialog; 