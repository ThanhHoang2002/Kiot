import axios from 'axios';

import { refreshToken } from "@/features/auth/apis/refreshToken";
import {toast} from "@/hooks/use-toast"
const axiosClient = axios.create({
  baseURL: import.meta.env.VITE_BASE_URL as string,
  headers: {
    "Content-Type": "application/json",
  },
  withCredentials: true,
});

// Middleware for request
axiosClient.interceptors.request.use((config) => {
  // Set the Authorization header for each request
  config.headers.Authorization = `Bearer ${localStorage.getItem("accessToken") ?? ""}`;
  return config;
});

// Middleware for response
axiosClient.interceptors.response.use(
  (response) => {
    return response;
  },
  async (error) => {
    const originalRequest = error.config;
    // handle expired token
    if (
      axios.isAxiosError(error) &&
      error.response?.status === 401 &&
      error.response?.data?.statusCode === 401 &&
      !originalRequest._retry
    ) {
      const accessToken = localStorage.getItem("accessToken");
      if (accessToken) {
        try {
          // if have accessToken, it should have refreshToken
          const accessToken  = await refreshToken();

          axios.defaults.headers.common["Authorization"] =
            `Bearer ${accessToken}`;

          localStorage.removeItem("accessToken");
          localStorage.setItem("accessToken", accessToken);
          return axiosClient(originalRequest); // Retry the original request with the new token
        } catch (error) {
          console.error(error)
          window.location.href = "/login";
        }
      } else {
        window.location.href = "/login";
      }
    }
    else{
      toast({
        title: "Lỗi",
        description: "Đã xảy ra lỗi, vui lòng thử lại",
        variant: "destructive",
      });
    }
    throw error;
  },
);

export default axiosClient;
