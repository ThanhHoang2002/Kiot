
import axiosClient from "@/lib/axios";
import { ApiResponse } from "@/types/apiResponse.type";
import { CurrentUser, User } from "@/types/auth.type";

export const getCurrentUser = async () : Promise<User> => {
    const response = await axiosClient.get<ApiResponse<CurrentUser>>('auth/account');
    return response.data.data.user;
}