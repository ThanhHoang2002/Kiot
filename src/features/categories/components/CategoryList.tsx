import { Package2Icon } from "lucide-react";

import EmptyState from "@/components/ui/empty-state";
import { LoadingIndicator } from "@/components/ui/loading-indicator";
import { Category } from "../types";
import { CategoryCard } from "./CategoryCard";

interface CategoryListProps {
  categories: Category[];
  isLoading: boolean;
  onEdit: (category: Category) => void;
  onDelete: (id: number) => void;
}

export const CategoryList = ({ categories, isLoading, onEdit, onDelete }: CategoryListProps) => {
  if (isLoading) {
    return (
      <div className="flex h-40 items-center justify-center">
        <LoadingIndicator />
      </div>
    );
  }

  if (categories.length === 0) {
    return (
      <EmptyState
        icon={<Package2Icon className="h-10 w-10" />}
        title="Không có danh mục nào"
        description="Chưa có danh mục nào được tạo. Hãy thêm danh mục mới."
      />
    );
  }

  return (
    <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
      {categories.map((category) => (
        <CategoryCard
          key={category.id}
          category={category}
          onEdit={onEdit}
          onDelete={onDelete}
        />
      ))}
    </div>
  );
}; 