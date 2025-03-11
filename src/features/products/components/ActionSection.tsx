import { FileDown, FileUp, History, Plus, Search } from 'lucide-react'

import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { useDebounceSearch } from '@/hooks/useDebounce';

interface Action {
  icon: React.ReactNode;
  label: string;
  onClick: () => void;
}

const actions: Action[] = [
  {
    icon: <Plus className="mr-2 h-4 w-4" />,
    label: 'Thêm mới',
    onClick: () => console.log('Thêm mới'),
  },
  {
    icon: <FileUp className="mr-2 h-4 w-4" />,
    label: 'Nhập file',
    onClick: () => console.log('Nhập file'),
  },
  {
    icon: <FileDown className="mr-2 h-4 w-4" />,
    label: 'Xuất file',
    onClick: () => console.log('Xuất file'),
  },
  {
    icon: <History className="mr-2 h-4 w-4" />,
    label: 'Lịch sử nhập',
    onClick: () => console.log('Lịch sử nhập'),
  }
];

interface ActionSectionProps {
  handleSearch: (value: string) => void;
}

const ActionSection = ({handleSearch}: ActionSectionProps) => {
  const { searchTerm, setSearchTerm } = useDebounceSearch(handleSearch, {
    delay: 500,
  });

  return (
    <div className="flex items-center justify-between gap-4">
      <div className="relative max-w-sm flex-1">
        <Search className="absolute left-2 top-2.5 h-4 w-4 text-gray-500" />
        <Input
          placeholder="Tìm kiếm theo mã, tên hàng..."
          className="pl-8"
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
        />
      </div>
      <div className="flex items-center gap-2">
        {actions.map((action, index) => (
          <Button
            key={index}
            size="sm"
            className='bg-[#00B63E] hover:bg-green-700'
            onClick={action.onClick}
          >
            {action.icon}
            {action.label}
          </Button>
        ))}
      </div>
    </div>
  );
}

export default ActionSection;