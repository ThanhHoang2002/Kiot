import { zodResolver } from '@hookform/resolvers/zod';
import { Loader2, UserCircle2 } from 'lucide-react';
import { useEffect } from 'react';
import { useForm } from 'react-hook-form';
import { z } from 'zod';

import { Button } from '@/components/ui/button';
import { FormField } from '@/components/ui/form-field';
import Image from '@/components/ui/image';
import { User } from '@/features/users/types';

// Định nghĩa schema cho form chỉnh sửa
const profileSchema = z.object({
  name: z.string().min(2, { message: 'Tên phải có ít nhất 2 ký tự' }),
  username: z.string().min(3, { message: 'Username phải có ít nhất 3 ký tự' }),
  email: z.string().email({ message: 'Email không hợp lệ' }),
  phoneNumber: z.string().min(8, { message: 'Số điện thoại phải có ít nhất 8 số' }).regex(/^\d+$/, { message: 'Số điện thoại chỉ bao gồm chữ số' }),
  gender: z.enum(['MALE', 'FEMALE', 'OTHER'], {
    errorMap: () => ({ message: 'Vui lòng chọn giới tính' })
  }),
  address: z.string().min(2, { message: 'Địa chỉ phải có ít nhất 2 ký tự' }),
});

export type ProfileFormValues = z.infer<typeof profileSchema>;

interface ProfileFormProps {
  userProfile?: User | null;
  avatarPreview: string | null;
  isSubmitting: boolean;
  onSubmit: (data: ProfileFormValues) => void;
  onAvatarChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  onCancel: () => void;
}

// Utility function để map role ID sang tên hiển thị
const getRoleName = (roleId?: number): string => {
  switch (roleId) {
    case 1:
      return 'Quản trị viên';
    case 2:
      return 'Nhân viên';
    default:
      return 'N/A';
  }
};

export const ProfileForm = ({
  userProfile,
  avatarPreview,
  isSubmitting,
  onSubmit,
  onAvatarChange,
  onCancel,
}: ProfileFormProps) => {
  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm<ProfileFormValues>({
    resolver: zodResolver(profileSchema),
    defaultValues: {
      name: '',
      username: '',
      email: '',
      phoneNumber: '',
      gender: 'MALE' as const,
      address: '',
    },
  });

  // Cập nhật form khi có dữ liệu từ API
  useEffect(() => {
    if (userProfile) {
      reset({
        name: userProfile.name || '',
        username: userProfile.username || '',
        email: userProfile.email || '',
        phoneNumber: userProfile.phoneNumber || '',
        gender: userProfile.gender || 'MALE',
        address: userProfile.address || '',
      });
    }
  }, [userProfile, reset]);

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
      {/* Avatar */}
      <div className="flex flex-col items-center space-y-4">
        <div className="overflow-hidden rounded-full">
          {avatarPreview ? (
            <Image
              src={avatarPreview}
              containerClassName="h-24 w-24 rounded-full"
              fallback={<UserCircle2 className="h-24 w-24 text-gray-300" />}
              alt="Avatar"
            />
          ) : (
            <UserCircle2 className="h-24 w-24 text-gray-300" />
          )}
        </div>
        
        <div>
          <label htmlFor="avatar" className="cursor-pointer">
            <span className="inline-flex items-center justify-center rounded-md bg-primary px-4 py-2 text-sm font-medium text-primary-foreground ring-offset-background transition-colors hover:bg-primary/90 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50">
              Thay đổi ảnh đại diện
            </span>
            <input
              type="file"
              id="avatar"
              accept="image/*"
              className="hidden"
              onChange={onAvatarChange}
              disabled={isSubmitting}
            />
          </label>
        </div>
      </div>

      <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
        {/* Họ tên */}
        <FormField
          id="name"
          label="Họ tên"
          placeholder="Nhập họ tên"
          error={errors.name}
          disabled={isSubmitting}
          registration={register('name')}
        />

        {/* Tên đăng nhập */}
        <FormField
          id="username"
          label="Tên đăng nhập"
          placeholder="Nhập tên đăng nhập"
          error={errors.username}
          disabled={isSubmitting}
          registration={register('username')}
        />

        {/* Email */}
        <FormField
          id="email"
          label="Email"
          placeholder="Nhập email"
          error={errors.email}
          disabled={isSubmitting}
          registration={register('email')}
        />

        {/* Số điện thoại */}
        <FormField
          id="phoneNumber"
          label="Số điện thoại"
          placeholder="Nhập số điện thoại"
          error={errors.phoneNumber}
          disabled={isSubmitting}
          registration={register('phoneNumber')}
        />

        {/* Giới tính */}
        <div className="space-y-2">
          <label htmlFor="gender" className="text-sm font-medium">Giới tính</label>
          <select
            id="gender"
            className="w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2"
            disabled={isSubmitting}
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
          disabled={isSubmitting}
          registration={register('address')}
        />
      </div>

      {/* Thông tin vai trò - chỉ hiển thị, không chỉnh sửa */}
      {userProfile && (
        <div className="rounded-md bg-muted p-4">
          <h3 className="mb-2 text-sm font-medium">Thông tin khác</h3>
          <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
            <div>
              <p className="text-xs text-muted-foreground">Vai trò</p>
              <p className="text-sm font-medium">{getRoleName(userProfile?.role?.id)}</p>
            </div>
            <div>
              <p className="text-xs text-muted-foreground">Ngày tạo tài khoản</p>
              <p className="text-sm font-medium">
                {userProfile?.createdAt 
                  ? new Date(userProfile.createdAt).toLocaleDateString('vi-VN', {
                      day: '2-digit',
                      month: '2-digit',
                      year: 'numeric',
                    }) 
                  : 'N/A'}
              </p>
            </div>
          </div>
        </div>
      )}

      <div className="flex justify-end gap-2">
        <Button
          type="button"
          variant="outline"
          onClick={onCancel}
          disabled={isSubmitting}
        >
          Hủy
        </Button>
        <Button type="submit" disabled={isSubmitting} className="flex items-center gap-2">
          {isSubmitting && <Loader2 className="h-4 w-4 animate-spin" />}
          {isSubmitting ? 'Đang xử lý...' : 'Cập nhật thông tin'}
        </Button>
      </div>
    </form>
  );
}; 