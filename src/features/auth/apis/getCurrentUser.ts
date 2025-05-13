
import axiosClient from "@/lib/axios";
import { ApiResponse } from "@/types/apiResponse.type";
import { User } from "@/types/auth.type";

export const getCurrentUser = async () => {
    const response = await axiosClient.get<ApiResponse<User>>('auth/account');
    return response.data.data;
}