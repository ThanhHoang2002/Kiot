import { User } from '@/features/users/types';
import axiosClient from '@/lib/axios';
import { ApiResponse } from '@/types/apiResponse.type';

/**
 * Lấy thông tin chi tiết của người dùng
 */
export const getUserProfile = async (userId: number): Promise<ApiResponse<User>> => {
  const response = await axiosClient.get<ApiResponse<User>>(`/users/${userId}`);
  return response.data;
};

/**
 * Cập nhật thông tin người dùng
 */
export const updateUserProfile = async (userId: number, userData: FormData | Record<string, unknown>): Promise<ApiResponse<User>> => {
  const config = userData instanceof FormData 
    ? { 
        headers: {
          'Content-Type': 'multipart/form-data'
        } 
      } 
    : {};
      
  const response = await axiosClient.put<ApiResponse<User>>(`/users/${userId}`, userData, config);
  return response.data;
};

/**
 * Đổi mật khẩu
 */
export const changePassword = async (passwordData: { 
  oldPassword: string, 
  newPassword: string 
  confirmPassword: string
}): Promise<ApiResponse<{ success: boolean }>> => {
  const response = await axiosClient.post<ApiResponse<{ success: boolean }>>(`/change-password`, passwordData);
  return response.data;
}; 