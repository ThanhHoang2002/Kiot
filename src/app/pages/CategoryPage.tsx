import { useState } from 'react';

import { Pagination } from '@/components/ui/pagination';
import { 
  Category,
  CategoryDialog, 
  CategoryList, 
  CategoryToolbar, 
  DeleteCategoryDialog, 
  useCategories 
} from '@/features/categories';

const CategoryPage = () => {
  const [selectedCategory, setSelectedCategory] = useState<Category | null>(null);
  const [isAddEditDialogOpen, setIsAddEditDialogOpen] = useState(false);
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);
  
  // Sử dụng hook quản lý danh sách danh mục
  const { 
    categories, 
    meta, 
    isLoading, 
    handleSearch, 
    handlePageChange,
    handlePageSizeChange,
  } = useCategories();

  // Xử lý thêm mới danh mục
  const handleAddCategory = () => {
    setSelectedCategory(null);
    setIsAddEditDialogOpen(true);
  };

  // Xử lý chỉnh sửa danh mục
  const handleEditCategory = (category: Category) => {
    setSelectedCategory(category);
    setIsAddEditDialogOpen(true);
  };

  // Xử lý xóa danh mục
  const handleDeleteCategory = (id: number) => {
    const category = categories.find(c => c.id === id);
    if (category) {
      setSelectedCategory(category);
      setIsDeleteDialogOpen(true);
    }
  };

  return (
    <div className="p-6">
      <div className="mb-6">
        <h1 className="text-2xl font-bold tracking-tight">Quản lý danh mục</h1>
        <p className="text-muted-foreground">
          Xem, thêm, sửa và xóa các danh mục sản phẩm
        </p>
      </div>

      {/* Toolbar */}
      <CategoryToolbar
        onSearch={handleSearch}
        onAddNew={handleAddCategory}
      />

      {/* Danh sách danh mục */}
      <CategoryList
        categories={categories}
        isLoading={isLoading}
        onEdit={handleEditCategory}
        onDelete={handleDeleteCategory}
      />

      {/* Phân trang - chỉ hiển thị khi có dữ liệu */}
      {meta && meta.total > 0 && (
        <div className="mt-6 flex justify-center">
          <Pagination
            page={meta.page}
            total={meta.total}
            pageSize={meta.pageSize}
            onPageChange={handlePageChange}
            onPageSizeChange={handlePageSizeChange}
          />
        </div>
      )}

      {/* Dialog thêm/sửa danh mục */}
      <CategoryDialog
        isOpen={isAddEditDialogOpen}
        category={selectedCategory}
        onOpenChange={setIsAddEditDialogOpen}
      />

      {/* Dialog xác nhận xóa */}
      <DeleteCategoryDialog
        isOpen={isDeleteDialogOpen}
        categoryId={selectedCategory?.id}
        categoryName={selectedCategory?.name}
        onOpenChange={setIsDeleteDialogOpen}
      />
    </div>
  );
};

export default CategoryPage;