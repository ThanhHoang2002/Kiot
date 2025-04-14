import axios from "axios";

import { ApiResponse } from "@/types/apiResponse.type";
import { LoginResponseData } from "@/types/auth.type";


export const login = async (username: string, password: string) => {
    const response = await axios.post<ApiResponse<LoginResponseData>>(import.meta.env.VITE_BASE_URL + 'auth/login', {
        username,
        password,
    });
    return response.data.data.access_token;
}