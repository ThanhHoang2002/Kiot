import { Search } from 'lucide-react';
import { memo } from 'react';

import { AddCustomerDialog } from '../AddCustomerDialog';

import { Input } from '@/components/ui/input';
import { useDebounceSearch } from '@/hooks/useDebounce';

interface ActionSectionProps {
  handleSearch: (value: string) => void;
}

const ActionSection = memo(({ handleSearch }: ActionSectionProps) => {
  const { searchTerm, setSearchTerm } = useDebounceSearch(handleSearch, {
    delay: 500,
  });

  return (
    <div className="flex items-center justify-between gap-4">
      <div className="relative max-w-sm flex-1">
        <Search className="absolute left-2 top-2.5 h-4 w-4 text-gray-500" />
        <Input
          placeholder="Tìm kiếm theo tên hoặc số điện thoại..."
          className="bg-white pl-8"
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
        />
      </div>
      <div className="flex items-center gap-2">
        <AddCustomerDialog />
      </div>
    </div>
  );
});

ActionSection.displayName = 'ActionSection';
export default ActionSection; 