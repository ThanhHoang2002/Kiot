import { useEffect, useState, useRef } from 'react';

/**
 * Custom hook for debouncing a value
 * @param value The value to debounce
 * @param delay The delay in milliseconds
 * @returns The debounced value
 */
export function useDebounce<T>(value: T, delay = 500): T {
  const [debouncedValue, setDebouncedValue] = useState<T>(value);
  const mountedRef = useRef(true);

  useEffect(() => {
    // Set debouncedValue to value after the specified delay
    const handler = setTimeout(() => {
      if (mountedRef.current) {
        setDebouncedValue(value);
      }
    }, delay);

    // Cancel the timeout if value changes (also on component unmount)
    return () => {
      clearTimeout(handler);
    };
  }, [value, delay]);

  // Cleanup when component unmounts
  useEffect(() => {
    return () => {
      mountedRef.current = false;
    };
  }, []);

  return debouncedValue;
}

/**
 * Custom hook for debounced search functionality
 * @param initialValue Initial search value
 * @param delay Debounce delay in milliseconds
 * @returns Object with searchValue, setSearchValue and debouncedSearchValue
 */
export function useDebounceSearch(initialValue = '', delay = 500) {
  const [searchValue, setSearchValue] = useState(initialValue);
  const debouncedSearchValue = useDebounce(searchValue, delay);

  return {
    searchValue,
    setSearchValue,
    debouncedSearchValue,
  };
} 