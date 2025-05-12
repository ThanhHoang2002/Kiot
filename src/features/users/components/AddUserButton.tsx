import { useMutation, useQueryClient } from '@tanstack/react-query';
import { Loader2, PlusCircle } from 'lucide-react';
import { useState } from 'react';
import { SubmitHandler } from 'react-hook-form';

import { createUser } from '../apis/users';
import { useAddUserForm } from '../hooks/useAddUserForm';
import { UserFormValues } from '../schemas/user-form.schema';
import { CreateUserPayload } from '../types';

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
import { Input } from '@/components/ui/input';
import { useToast } from '@/hooks/use-toast';

const USERS_QUERY_KEY = ['users'] as const;

interface AddUserButtonProps {
  onCreateUser?: (userData: FormData) => Promise<void>;
}

const AddUserButton = ({ onCreateUser }: AddUserButtonProps) => {
  const [open, setOpen] = useState(false);
  const [avatarFile, setAvatarFile] = useState<File | null>(null);
  const { toast } = useToast();
  const queryClient = useQueryClient();

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors, isSubmitting },
  } = useAddUserForm();

  const { mutate: addUser, isPending } = useMutation({
    mutationFn: async (data: CreateUserPayload) => {
      // Tạo FormData để gửi dữ liệu kèm file
      const formData = new FormData();
      
      // Thêm các field thông tin người dùng vào FormData
      Object.entries(data).forEach(([key, value]) => {
        if (value !== undefined && value !== null) {
          formData.append(key, String(value));
        }
      });
      
      // Thêm file avatar vào FormData nếu có
      if (avatarFile) {
        formData.append('avatar', avatarFile);
      }
      
      // Gọi API thông qua prop hoặc hàm mặc định
      if (onCreateUser) {
        return onCreateUser(formData);
      }
      
      // Nếu không có prop onCreateUser, gọi trực tiếp API
      return createUser(formData);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: USERS_QUERY_KEY });

      toast({
        title: 'Thành công',
        description: 'Người dùng mới đã được tạo',
      });

      reset();
      setAvatarFile(null);
      setOpen(false);
    },
    onError: (error) => {
      console.error('Failed to create user:', error);
      toast({
        title: 'Lỗi',
        description: 'Không thể tạo người dùng. Vui lòng thử lại.',
        variant: 'destructive',
      });
    },
  });

  const onSubmit: SubmitHandler<UserFormValues> = async (data) => {
    // eslint-disable-next-line @typescript-eslint/no-unused-vars, unused-imports/no-unused-vars
    const { confirmPassword, ...userData } = data;
    await addUser(userData as CreateUserPayload);
  };

  const handleAvatarChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      setAvatarFile(e.target.files[0]);
    }
  };

  const isLoading = isPending || isSubmitting;

  return (
    <>
      <Button onClick={() => setOpen(true)} className="flex items-center gap-2">
        <PlusCircle className="h-4 w-4" />
        Thêm người dùng
      </Button>

      <Dialog open={open} onOpenChange={(isOpen) => {
        // Không cho phép đóng dialog khi đang xử lý
        if (isLoading) return;
        
        setOpen(isOpen);
        if (!isOpen) {
          reset();
          setAvatarFile(null);
        }
      }}>
        <DialogContent className="sm:max-w-[550px]">
          <DialogHeader>
            <DialogTitle>Thêm người dùng mới</DialogTitle>
            <DialogDescription>
              Nhập thông tin người dùng để tạo tài khoản mới
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

            {/* Email */}
            <FormField
              id="email"
              label="Email"
              type="email"
              placeholder="Nhập địa chỉ email"
              error={errors.email}
              disabled={isLoading}
              registration={register('email')}
            />

            {/* Số điện thoại */}
            <FormField
              id="phoneNumber"
              label="Số điện thoại"
              placeholder="Nhập số điện thoại"
              error={errors.phoneNumber}
              disabled={isLoading}
              registration={register('phoneNumber')}
            />

            {/* Mật khẩu */}
            <FormField
              id="password"
              label="Mật khẩu"
              type="password"
              placeholder="Nhập mật khẩu"
              error={errors.password}
              disabled={isLoading}
              registration={register('password')}
            />

            {/* Xác nhận mật khẩu */}
            <FormField
              id="confirmPassword"
              label="Xác nhận mật khẩu"
              type="password"
              placeholder="Xác nhận mật khẩu"
              error={errors.confirmPassword}
              disabled={isLoading}
              registration={register('confirmPassword')}
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
                <option value="">Chọn vai trò</option>
                <option value="1">Quản trị viên</option>
                <option value="2">Nhân viên</option>
              </select>
              {errors.roleId && (
                <p className="text-xs text-red-500">{errors.roleId.message}</p>
              )}
            </div>

            {/* Avatar */}
            <div className="col-span-1 space-y-2 md:col-span-2">
              <label htmlFor="avatar" className="text-sm font-medium">Avatar</label>
              <Input
                id="avatar"
                type="file"
                accept="image/*"
                onChange={handleAvatarChange}
                className="cursor-pointer"
                disabled={isLoading}
              />
              {avatarFile && (
                <div className="mt-2 flex items-center gap-2">
                  <img 
                    src={URL.createObjectURL(avatarFile)} 
                    alt="Avatar preview" 
                    className="h-10 w-10 rounded-full object-cover" 
                  />
                  <span className="text-xs text-muted-foreground">{avatarFile.name}</span>
                </div>
              )}
            </div>

            <DialogFooter className="col-span-1 mt-6 md:col-span-2">
              <Button type="button" variant="outline" onClick={() => setOpen(false)} disabled={isLoading}>
                Hủy
              </Button>
              <Button type="submit" disabled={isLoading} className="flex items-center gap-2">
                {isLoading && <Loader2 className="h-4 w-4 animate-spin" />}
                {isLoading ? 'Đang xử lý...' : 'Thêm người dùng'}
              </Button>
            </DialogFooter>
          </form>
        </DialogContent>
      </Dialog>
    </>
  );
};

export default AddUserButton;