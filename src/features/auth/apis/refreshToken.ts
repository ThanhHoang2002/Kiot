import { ApiResponse } from "@/types/apiResponse.type";
import { LoginResponseData } from "@/types/auth.type";
import axios from "axios";
const BASE_URL = import.meta.env.VITE_BASE_URL;
export const refreshToken = async () => {
    const response = await axios.get<ApiResponse<LoginResponseData>>(`${BASE_URL}/auth/refresh`);
    return response.data.data.access_token;
}