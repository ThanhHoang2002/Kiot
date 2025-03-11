import { useState, useEffect, useRef } from 'react';

interface DebounceOptions {
  delay?: number;
  leading?: boolean; // Thêm option để trigger ngay lần đầu tiên
  maxWait?: number; // Thêm max time chờ
}

export function useDebounce<T>(
  value: T, 
  options: DebounceOptions = {}
): T {
  const { delay = 500, leading = false, maxWait } = options;
  const [debouncedValue, setDebouncedValue] = useState<T>(leading ? value : undefined as T);
  
  useEffect(() => {
    const lastInvokeTime = Date.now();
    const timeoutRef = { current: undefined as NodeJS.Timeout | undefined };
    let maxTimeoutId: NodeJS.Timeout | undefined;

    // Hàm update value
    const updateValue = () => {
      setDebouncedValue(value);
    };

    // Clear tất cả timeouts
    const cleanup = () => {
      if (timeoutRef.current) clearTimeout(timeoutRef.current);
      if (maxTimeoutId) clearTimeout(maxTimeoutId);
    };

    // Nếu có maxWait, đảm bảo function sẽ được gọi ít nhất một lần trong khoảng maxWait
    if (maxWait) {
      const shouldCallNow = Date.now() - lastInvokeTime >= maxWait;
      if (shouldCallNow) {
        updateValue();
      } else {
        maxTimeoutId = setTimeout(updateValue, maxWait);
      }
    }

    // Normal debounce behavior
    timeoutRef.current = setTimeout(updateValue, delay);

    // Cleanup function
    return cleanup;
  }, [value, delay, maxWait, leading]);

  return debouncedValue as T;
}

// Thêm một hook riêng cho search để tái sử dụng logic search
export function useDebounceSearch(
  callback: (value: string) => void,
  options: DebounceOptions = {}
) {
  const [searchTerm, setSearchTerm] = useState('');
  const debouncedValue = useDebounce(searchTerm, options);
  const previousValueRef = useRef(debouncedValue);

  useEffect(() => {
    // Chỉ gọi callback khi debouncedValue thực sự thay đổi
    if (debouncedValue !== previousValueRef.current) {
      previousValueRef.current = debouncedValue; 
        callback(debouncedValue);
    }
  }, [debouncedValue, callback]);

  return {
    searchTerm,
    setSearchTerm,
    debouncedValue
  };
}