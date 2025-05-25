import { AxiosError } from 'axios';

import { useToast } from '@/hooks/use-toast';

export interface ApiErrorResponse {
  error?: string;
  message?: string;
  status?: number;
  errors?: Record<string, string[]>;
  statusCode?: number;
  data?: unknown;
}

/**
 * Hook để xử lý lỗi API trả về từ Axios
 * Phân tích lỗi và hiển thị thông báo phù hợp
 */
export const useApiErrorHandler = () => {
  const { toast } = useToast();

  /**
   * Xử lý và hiển thị lỗi từ response API
   * @param error - Lỗi từ Axios
   * @param fallbackMessage - Thông báo mặc định nếu không lấy được lỗi cụ thể
   */
  const handleError = (error: unknown, fallbackMessage = 'Đã xảy ra lỗi. Vui lòng thử lại sau.') => {
    if (!(error instanceof Error)) {
      showErrorToast(fallbackMessage);
      return;
    }

    const axiosError = error as AxiosError<ApiErrorResponse>;
    
    // Log lỗi để debug
    if (import.meta.env.DEV) {
      console.error('API Error:', axiosError);
    }
    
    // Lấy thông báo lỗi từ response
    const responseData = axiosError.response?.data;
    if (!responseData) {
      showErrorToast(fallbackMessage);
      return;
    }
    
    // Ưu tiên hiển thị trường error từ response
    const errorMessage = responseData.message || fallbackMessage;
    showErrorToast(errorMessage);
  };

  const showErrorToast = (message: string) => {
    toast({
      title: 'Lỗi',
      description: message,
      variant: 'destructive',
    });
  };

  return { handleError };
}; 