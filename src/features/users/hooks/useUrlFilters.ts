import { useCallback } from 'react';
import { useSearchParams } from 'react-router-dom';

import { Gender, UserFilterParams } from '../types';

interface UseUrlFiltersOptions {
  initialFilters?: UserFilterParams;
}

export const useUrlFilters = ({ initialFilters = {} }: UseUrlFiltersOptions = {}) => {
  const [searchParams, setSearchParams] = useSearchParams();
  
  // Tính toán filters trực tiếp từ searchParams
  const filters: UserFilterParams = {
    search: searchParams.get('search') || initialFilters.search,
    roleId: searchParams.get('roleId') ? Number(searchParams.get('roleId')) : initialFilters.roleId,
    gender: (searchParams.get('gender') as Gender) || initialFilters.gender,
    page: Number(searchParams.get('page')) || initialFilters.page || 1,
    pageSize: Number(searchParams.get('pageSize')) || initialFilters.pageSize || 20
  };

  // Giá trị được chọn cho UI
  const selectedRoleId = searchParams.get('roleId') || 
    (initialFilters.roleId !== undefined ? String(initialFilters.roleId) : '');
  
  const selectedGender = searchParams.get('gender') || initialFilters.gender || '';
  
  // Cập nhật filters sử dụng useCallback
  const updateFilters = useCallback(
    (newFilters: Partial<UserFilterParams>) => {
      const updatedParams = new URLSearchParams(searchParams);

      // Cập nhật chỉ các params mới
      Object.entries(newFilters).forEach(([key, value]) => {
        if (value !== undefined && value !== null && value !== '') {
          // Reset về trang 1 nếu thay đổi search, roleId hoặc gender
          if (['search', 'roleId', 'gender'].includes(key)) {
            updatedParams.set('page', '1');
          }
          updatedParams.set(key, String(value).trim());
        } else {
          updatedParams.delete(key);
        }
      });

      setSearchParams(updatedParams);
    },
    [searchParams, setSearchParams]
  );

  // Các helper functions cho các trường cụ thể
  const updateSearch = useCallback(
    (search: string) => {
      updateFilters({ search: search.trim(), page: 1 });
    },
    [updateFilters]
  );

  const updateRole = useCallback(
    (roleId: number | string) => {
      const numericRoleId = typeof roleId === 'string' ? parseInt(roleId, 10) : roleId;
      if (isNaN(numericRoleId) || numericRoleId <= 0) {
        updateFilters({ roleId: undefined, page: 1 });
      } else {
        updateFilters({ roleId: numericRoleId, page: 1 });
      }
    },
    [updateFilters]
  );

  const updateGender = useCallback(
    (gender: Gender | string) => {
      if (!gender || gender === 'all') {
        updateFilters({ gender: undefined, page: 1 });
      } else {
        updateFilters({ gender: gender as Gender, page: 1 });
      }
    },
    [updateFilters]
  );

  const updatePage = useCallback(
    (page: number) => {
      updateFilters({ page });
    },
    [updateFilters]
  );

  const resetFilters = useCallback(
    () => {
      setSearchParams({});
    },
    [setSearchParams]
  );

  return {
    filters,
    searchTerm: filters.search || '',
    selectedRoleId,
    selectedGender,
    updateSearch,
    updateRole,
    updateGender,
    updatePage,
    updateFilters,
    resetFilters
  };
}; 