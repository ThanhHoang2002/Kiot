import { ChangeEvent, memo, useCallback, useEffect } from 'react';

import { UserFilterParams } from '../types';

import { Input } from '@/components/ui/input';
import { useDebounceSearch } from '@/hooks/useDebounce';

interface UserFiltersProps {
  onFilterChange: (filters: UserFilterParams) => void;
  initialFilters?: UserFilterParams;
}

const UserFilters = memo(({ onFilterChange, initialFilters = {} }: UserFiltersProps) => {
  // Setup debounced search hook
  const { searchTerm, setSearchTerm } = useDebounceSearch(
    useCallback((value: string) => {
      onFilterChange({ search: value || undefined, page: 1 });
    }, [onFilterChange]),
    { delay: 500 }
  );
  
  // Set initial search term on mount
  useEffect(() => {
    if (initialFilters.search) {
      setSearchTerm(initialFilters.search);
    }
  }, [initialFilters.search, setSearchTerm]);

  // Event handler for input change
  const handleInputChange = useCallback((event: ChangeEvent<HTMLInputElement>) => {
    setSearchTerm(event.target.value);
  }, [setSearchTerm]);

  // Render filter component with only search
  return (
    <div className="mb-6 w-1/4">
      <div className="relative w-full sm:max-w-md md:max-w-lg">
        <Input
          type="text"
          placeholder="Tìm kiếm theo tên, tài khoản..."
          value={searchTerm}
          onChange={handleInputChange}
          className="w-full"
          aria-label="Tìm kiếm người dùng"
        />
      </div>
    </div>
  );
});

UserFilters.displayName = 'UserFilters';
export default UserFilters; 