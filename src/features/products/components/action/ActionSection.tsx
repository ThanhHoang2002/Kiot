import { Plus, Search } from 'lucide-react'
import { memo, useState } from 'react';

import { ProductDetailModal } from '../detail-product/ProductDetailModal';

import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { useDebounceSearch } from '@/hooks/useDebounce';

interface ActionSectionProps {
  handleSearch: (value: string) => void;
}

const ActionSection = memo(({ handleSearch }: ActionSectionProps) => {
  const { searchTerm, setSearchTerm } = useDebounceSearch(handleSearch, {
    delay: 500,
  });
  
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);

  const handleAddProduct = () => {
    setIsAddModalOpen(true);
  };

  const handleCloseModal = () => {
    setIsAddModalOpen(false);
  };

  return (
    <>
      <div className="flex items-center justify-between gap-4">
        <div className="relative max-w-sm flex-1">
          <Search className="absolute left-2 top-2.5 h-4 w-4 text-gray-500" />
          <Input
            placeholder="Tìm kiếm theo tên hàng..."
            className="bg-white pl-8"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>
        <div className="flex items-center gap-2">
          <Button
            size="sm"
            className='bg-[#00B63E] hover:bg-green-700'
            onClick={handleAddProduct}
          >
            <Plus className="mr-2 h-4 w-4" />
            Thêm mới
          </Button>
        </div>
      </div>

      {/* Modal thêm sản phẩm mới */}
      <ProductDetailModal 
        isOpen={isAddModalOpen}
        onClose={handleCloseModal}
      />
    </>
  );
})

ActionSection.displayName = 'ActionSection';
export default ActionSection;