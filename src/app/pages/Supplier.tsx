import { useCallback, useState } from 'react';

import { Pagination } from '@/components/ui/pagination';
import { Separator } from '@/components/ui/separator';
import {
  DeleteSupplierDialog,
  Supplier as SupplierType,
  SupplierDialog,
  SupplierList,
  SupplierToolbar,
  useSuppliers,
} from '@/features/supplier';

const Supplier = () => {
  // State cho thêm/sửa và xóa nhà cung cấp
  const [selectedSupplier, setSelectedSupplier] = useState<SupplierType | null>(null);
  const [isAddEditOpen, setIsAddEditOpen] = useState(false);
  const [isDeleteOpen, setIsDeleteOpen] = useState(false);
  const [supplierToDelete, setSupplierToDelete] = useState<{id: number, name: string} | null>(null);

  // Hook để lấy danh sách nhà cung cấp
  const {
    suppliers,
    meta,
    isLoading,
    handlePageChange,
    handlePageSizeChange,
    handleSearch,
    refetch,
  } = useSuppliers();

  // Xử lý khi thêm nhà cung cấp mới - sử dụng useCallback để tránh tạo lại function mỗi lần render
  const handleAddSupplier = useCallback(() => {
    setSelectedSupplier(null);
    setIsAddEditOpen(true);
  }, []);

  // Xử lý khi chỉnh sửa nhà cung cấp
  const handleEditSupplier = useCallback((supplier: SupplierType) => {
    setSelectedSupplier(supplier);
    setIsAddEditOpen(true);
  }, []);

  // Xử lý khi xóa nhà cung cấp
  const handleDeleteSupplier = useCallback((id: number) => {
    const supplier = suppliers.find(s => s.id === id);
    if (supplier) {
      setSupplierToDelete({
        id: supplier.id,
        name: supplier.name,
      });
      setIsDeleteOpen(true);
    }
  }, [suppliers]);

  // Xử lý khi đóng dialog
  const handleOpenChangeAddEdit = useCallback((open: boolean) => {
    setIsAddEditOpen(open);
  }, []);

  // Xử lý khi đóng dialog xóa
  const handleOpenChangeDelete = useCallback((open: boolean) => {
    setIsDeleteOpen(open);
  }, []);

  return (
    <div className="p-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold">Quản lý nhà cung cấp</h1>
          <p className="text-sm text-muted-foreground">Quản lý danh sách nhà cung cấp sản phẩm</p>
        </div>
      </div>
      <Separator className="my-4" />
      
      {/* Thanh công cụ với tìm kiếm và nút thêm mới */}
      <SupplierToolbar
        onAddClick={handleAddSupplier}
        onSearch={handleSearch}
      />
      
      {/* Danh sách nhà cung cấp */}
      <SupplierList
        suppliers={suppliers}
        isLoading={isLoading}
        onEdit={handleEditSupplier}
        onDelete={handleDeleteSupplier}
      />
      
      {/* Phân trang */}
      {meta && meta.total > 0 && (
        <div className="mt-8 flex items-center justify-center">
          <Pagination
            page={meta.page}
            total={meta.total}
            pageSize={meta.pageSize}
            siblingCount={1}
            onPageChange={handlePageChange}
            onPageSizeChange={handlePageSizeChange}
          />
        </div>
      )}
      
      {/* Dialog thêm/sửa nhà cung cấp */}
      <SupplierDialog
        isOpen={isAddEditOpen}
        supplier={selectedSupplier}
        onOpenChange={handleOpenChangeAddEdit}
        onSuccess={refetch}
      />
      
      {/* Dialog xác nhận xóa nhà cung cấp */}
      <DeleteSupplierDialog
        isOpen={isDeleteOpen}
        supplierId={supplierToDelete?.id}
        supplierName={supplierToDelete?.name}
        onOpenChange={handleOpenChangeDelete}
        onSuccess={refetch}
      />
    </div>
  );
};

export default Supplier;