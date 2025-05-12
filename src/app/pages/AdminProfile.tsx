import { Key } from 'lucide-react';
import { useState } from 'react';

import { Button } from '@/components/ui/button';
import { LoadingIndicator } from '@/components/ui/loading-indicator';
import {
  useUserProfile,
  ProfileForm,
  PasswordDialog,
  PasswordFormValues
} from '@/features/profile';

const AdminProfile = () => {
  // Lấy userId từ localStorage để gọi API
  const rawData = localStorage.getItem('currentUser') || '{}';
  const parsedData = JSON.parse(rawData);
  const userId = parsedData.user?.id;
  
  const [isPasswordDialogOpen, setIsPasswordDialogOpen] = useState(false);
  
  // Sử dụng custom hook để quản lý logic
  const {
    userProfile,
    isLoading,
    avatarPreview,
    isUpdating,
    isChangingPassword,
    updateProfile,
    changePassword,
    handleAvatarChange,
    resetForm
  } = useUserProfile(userId);

  // Hiển thị loading khi đang tải dữ liệu
  if (isLoading) {
    return <LoadingIndicator />;
  }

  return (
    <div className="mx-auto max-w-3xl p-4">
      <div className="mb-8">
        <h1 className="text-2xl font-bold tracking-tight">Thông tin cá nhân</h1>
        <p className="text-muted-foreground">
          Xem và cập nhật thông tin cá nhân của bạn
        </p>
      </div>

      <div className="rounded-lg border bg-card p-6 shadow-sm">
        {/* Form thông tin cá nhân */}
        <ProfileForm 
          userProfile={userProfile}
          avatarPreview={avatarPreview}
          isSubmitting={isUpdating}
          onSubmit={updateProfile}
          onAvatarChange={handleAvatarChange}
          onCancel={resetForm}
        />

        {/* Nút đổi mật khẩu */}
        <div className="mt-4 border-t pt-4">
          <Button
            type="button"
            variant="outline"
            className="flex items-center gap-1"
            onClick={() => setIsPasswordDialogOpen(true)}
          >
            <Key className="h-4 w-4" />
            Đổi mật khẩu
          </Button>
        </div>

        {/* Dialog đổi mật khẩu */}
        <PasswordDialog 
          isOpen={isPasswordDialogOpen}
          isSubmitting={isChangingPassword}
          onOpenChange={setIsPasswordDialogOpen}
          onSubmit={(data: PasswordFormValues) => {
            changePassword({
              currentPassword: data.currentPassword,
              newPassword: data.newPassword,
              confirmPassword: data.confirmPassword
            });
          }}
        />
      </div>
    </div>
  );
};

export default AdminProfile;