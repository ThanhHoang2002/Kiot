import React, { useState } from 'react';

import { ProductDetailModal } from './ProductDetailModal';
import { ProductRow } from './ProductRow';
import { ProductsActionDrawer } from './ProductsActionDrawer';
import { ProductsPagination } from './ProductsPagination';
import { ProductTableSkeleton } from './ProductTableSkeleton';
import { ProductsResponse } from '../types/product';

import { Checkbox } from '@/components/ui/checkbox';
import {
  Table,
  TableBody,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';

interface Column {
  key: string;
  label: string;
  align: string;
}

const COLUMNS: Column[] = [
  { key: 'code', label: 'Mã hàng',align: 'text-left' },
  { key: 'name', label: 'Tên hàng',align: 'text-left' },
  { key: 'sellPrice', label: 'Giá bán', align: 'text-right' },
  { key: 'costPrice', label: 'Giá vốn', align: 'text-right' },
  { key: 'quantity', label: 'Số lượng', align: 'text-center' },
  { key: 'status', label: 'Trạng thái',align: 'text-left' },
  { key: 'createdAt', label: 'Thời gian tạo',align: 'text-left' },
  { key: 'category', label: 'Danh mục',align: 'text-left' },
] as const;

interface ProductsTableProps {
  data: ProductsResponse | undefined;
  isLoading: boolean;
  page: number;
  limit: number;
  selectedProducts: string[];
  handleToggleSelect: (productId: string) => void;
  handleSelectAll: (checked: boolean) => void;
  handlePageChange: (page: number) => void;
  handleDeleteSelected?: () => void;
}

export const ProductsTable: React.FC<ProductsTableProps> = (props) => {
  const {
    data,
    isLoading,
    page,
    limit,
    selectedProducts,
    handleToggleSelect,
    handleSelectAll,
    handlePageChange,
    handleDeleteSelected,
  } = props;
  const [isOpen, setIsOpen] = useState(false);
  const [selectedProduct, setSelectedProduct] = useState<string>('');

  const handleOpenModal = (productId: string) => {
    setSelectedProduct(productId);
    setIsOpen(true);
  };
  const handleCloseModal = () => {
    setIsOpen(false);
  };
  if (isLoading) {
    return <ProductTableSkeleton />;
  }

  if (!data) return null;

  const totalPages = Math.ceil(data.total / limit);
  return (
    <div className="space-y-4">
      <Table>
        <TableHeader className='bg-secondary'>
          <TableRow>
            <TableHead className="w-12">
              <Checkbox
                checked={data.data.length > 0 && selectedProducts.length === data.data.length}
                onCheckedChange={handleSelectAll}
              />
            </TableHead>
            {COLUMNS.map(column => (
              <TableHead 
                key={column.key}
                className={column.align}
              >
                {column.label}
              </TableHead>
            ))}
          </TableRow>
        </TableHeader>
        <TableBody>
          {data.data.map((product) => (
            <ProductRow
              key={product.id}
              product={product}
              isSelected={selectedProducts.includes(product.id)}
              onToggleSelect={handleToggleSelect}
              onClick={handleOpenModal}
            />
          ))}
        </TableBody>
      </Table>

      <ProductsPagination
        currentPage={page}
        totalPages={totalPages}
        onPageChange={handlePageChange}
        itemsPerPage={limit}
        totalItems={data.total}         
      />

      <ProductsActionDrawer
        selectedCount={selectedProducts.length}
        onDelete={handleDeleteSelected || (() => {
          console.log(selectedProducts)
        })}
        onCancel={handleSelectAll}
      />
      <ProductDetailModal isOpen={isOpen} onClose={handleCloseModal} productId={selectedProduct} />
    </div>
  );
}; 