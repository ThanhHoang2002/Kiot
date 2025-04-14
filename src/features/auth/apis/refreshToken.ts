import axiosClient from "@/lib/axios";
import { ApiResponse } from "@/types/apiResponse.type";
import { LoginResponseData } from "@/types/auth.type";

export const refreshToken = async () => {
    const response = await axiosClient.get<ApiResponse<LoginResponseData>>('auth/refresh');
    return response.data.data.access_token;
}