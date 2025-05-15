import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';

import { getUserProfile, updateUserProfile, changePassword } from '../api/profileApi';

import { useToast } from '@/hooks/use-toast';
import useAuthStore from '@/store/authStore';

type ProfileFormData = {
  name: string;
  username: string;
  gender: 'MALE' | 'FEMALE' | 'OTHER';
  address: string;
};

type PasswordFormData = {
  currentPassword: string;
  newPassword: string;
  confirmPassword: string;
};

export const useUserProfile = (userId: number) => {
  const [avatarFile, setAvatarFile] = useState<File | null>(null);
  const [avatarPreview, setAvatarPreview] = useState<string | null>(null);
  const { toast } = useToast();
  const queryClient = useQueryClient();
  const { setCurrentUser } = useAuthStore();
  const navigate = useNavigate();
  // Query để lấy thông tin người dùng
  const {
    data: profileData,
    isLoading,
    error,
  } = useQuery({
    queryKey: ['userProfile', userId],
    queryFn: () => getUserProfile(userId),
    enabled: !!userId,
  });

  // Cập nhật avatar preview khi có dữ liệu
  const userProfile = profileData?.data;

  // Cập nhật preview khi có dữ liệu mới
  useEffect(() => {
    if (userProfile?.avatar && !avatarPreview) {
      setAvatarPreview(userProfile.avatar);
    }
  }, [userProfile, avatarPreview]);

  // Mutation để cập nhật thông tin người dùng
  const updateProfileMutation = useMutation({
    mutationFn: (data: ProfileFormData) => {
      // Tạo FormData nếu có file avatar
      let payload: FormData | ProfileFormData = data;

      if (avatarFile) {
        const formData = new FormData();
        formData.append('avatar', avatarFile);
        formData.append('name', data.name);
        formData.append('username', data.username);
        formData.append('gender', data.gender);
        formData.append('address', data.address);
        payload = formData;
      }

      return updateUserProfile(userId, payload);
    },
    onSuccess: (response) => {
      // Cập nhật thông tin người dùng trong store và localStorage
      if (response?.data) {
        const updatedUser = response.data;

        // Lấy dữ liệu hiện tại từ localStorage
        const currentData = JSON.parse(localStorage.getItem('currentUser') || '{}');
        // Cập nhật user trong object
        currentData.user = updatedUser;
        // Lưu lại vào localStorage
        localStorage.setItem('currentUser', JSON.stringify(currentData));

        // Cập nhật store - bỏ qua lỗi type mismatch
        // @ts-expect-error - Bỏ qua lỗi type mismatch
        setCurrentUser(updatedUser);

        // Invalidate queries
        queryClient.invalidateQueries({ queryKey: ['info'] });
        queryClient.invalidateQueries({ queryKey: ['userProfile', userId] });

        toast({
          title: 'Thành công',
          description: 'Thông tin cá nhân đã được cập nhật',
        });
      }
    },
    onError: (error) => {
      console.error('Failed to update profile:', error);
      toast({
        title: 'Lỗi',
        description: 'Không thể cập nhật thông tin cá nhân',
        variant: 'destructive',
      });
    },
  });

  // Mutation để đổi mật khẩu
  const changePasswordMutation = useMutation({
    mutationFn: (data: PasswordFormData) =>
      changePassword({
        oldPassword: data.currentPassword,
        newPassword: data.newPassword,
        confirmPassword: data.confirmPassword,
      }),
    onSuccess: () => {
      toast({
        title: 'Thành công',
        description: 'Mật khẩu đã được thay đổi thành công',
      });
    },
    onError: (error) => {
      console.error('Failed to change password:', error);
      toast({
        title: 'Lỗi',
        description: 'Không thể thay đổi mật khẩu. Vui lòng kiểm tra lại mật khẩu hiện tại.',
        variant: 'destructive',
      });
    },
  });

  // Xử lý khi thay đổi avatar
  const handleAvatarChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setAvatarFile(file);
      // Tạo URL preview
      const previewUrl = URL.createObjectURL(file);
      setAvatarPreview(previewUrl);
    }
  };

  // Reset form về trạng thái ban đầu
  const resetForm = () => {
    setAvatarFile(null);
    if (userProfile?.avatar) {
      setAvatarPreview(userProfile.avatar);
    }
    navigate('/');
  };

  return {
    userProfile,
    isLoading,
    error,
    avatarPreview,
    avatarFile,
    isUpdating: updateProfileMutation.isPending,
    isChangingPassword: changePasswordMutation.isPending,
    updateProfile: updateProfileMutation.mutate,
    changePassword: changePasswordMutation.mutate,
    handleAvatarChange,
    resetForm,
  };
}; 