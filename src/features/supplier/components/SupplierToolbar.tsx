import { PlusIcon, SearchIcon } from "lucide-react";
import { useState, useEffect } from "react";

import { Button } from "@/components/ui/button";
import { useDebounce } from "@/hooks/use-debounce-search";

interface SupplierToolbarProps {
  onAddClick: () => void;
  onSearch: (search: string) => void;
  initialSearchValue?: string;
}

export const SupplierToolbar = ({ onAddClick, onSearch, initialSearchValue = "" }: SupplierToolbarProps) => {
  // Sử dụng state đơn giản thay vì custom hook để tránh vòng lặp
  const [searchValue, setSearchValue] = useState(initialSearchValue);
  const debouncedValue = useDebounce(searchValue, 500);
  
  // Xử lý tìm kiếm khi giá trị debounced thay đổi
  useEffect(() => {
    // Chỉ gọi onSearch khi debouncedValue đã thực sự thay đổi
    onSearch(debouncedValue);
  }, [debouncedValue, onSearch]);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSearchValue(e.target.value);
  };

  return (
    <div className="flex flex-col space-y-4 pb-6 sm:flex-row sm:items-center sm:justify-between sm:space-y-0">
      <div className="relative max-w-sm flex-1">
        <SearchIcon className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
        <input
          type="search"
          placeholder="Tìm kiếm nhà cung cấp..."
          value={searchValue}
          onChange={handleInputChange}
          className="w-full rounded-md border border-input bg-background py-2 pl-8 pr-3 text-sm ring-offset-background placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2"
        />
      </div>
      <Button onClick={onAddClick} className="sm:ml-4">
        <PlusIcon className="mr-2 h-4 w-4" />
        Thêm nhà cung cấp
      </Button>
    </div>
  );
}; 