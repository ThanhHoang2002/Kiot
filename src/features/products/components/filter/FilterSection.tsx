import { memo } from "react";

import FilterItem, { FilterItemProps } from "./FilterItem";
import { ProductsParams } from "../../api/productsApi";
import { useCategories } from "../../hooks/useCategories";
import { useSuppliers } from "../../hooks/useSuppliers";

const STATUS_OPTIONS = [
  { value: "Còn hàng", label: "Còn hàng" },
  { value: "Ngừng kinh doanh", label: "Ngừng kinh doanh" },
  { value: "Hết hàng", label: "Hết hàng" },
];

interface FilterSectionProps {
  filters: ProductsParams;
  updateFilters: (filters: Partial<ProductsParams>) => void;
}

const FilterSection = memo(({ filters, updateFilters }: FilterSectionProps) => {
  // Use the new hooks to fetch categories and suppliers
  const { data: categoriesData } = useCategories();
  const { data: suppliersData } = useSuppliers();

  const handleStatusChange = (value: string) => {
    updateFilters({ status: value, page: 1 });
  };

  const handleCategoryChange = (value: string) => {
    updateFilters({ categoryId: value ? Number(value) : undefined, page: 1 });
  };

  const handleSupplierChange = (value: string) => {
    updateFilters({ supplierId: value ? Number(value) : undefined, page: 1 });
  };
  const FILTERS: FilterItemProps[] = [
    {
      name: "Trạng thái",
      items: STATUS_OPTIONS,
      currentValue: filters.status,
      action: handleStatusChange,
    },
    {
      name: "Danh mục",
      items: categoriesData?.map((category) => ({
        value: category.id,
        label: category.name,
      })),
      currentValue: filters.categoryId?.toString(),
      action: handleCategoryChange,
    },
    {
      name: "Nhà cung cấp",
      items: suppliersData?.map((supplier) => ({
        value: supplier.id,
        label: supplier.name,
      })),
      currentValue: filters.supplierId?.toString(),
      action: handleSupplierChange,
    },
  ] as const;
  return (
    <div className="flex flex-col gap-5 p-2 ">
      <h2 className="text-3xl font-semibold">Hàng hóa</h2>
      {FILTERS.map(
        (filter) =>
          filter.items && (
            <FilterItem
              key={filter.name}
              name={filter.name}
              items={filter.items}
              action={filter.action}
              currentValue={filter.currentValue}
            />
          )
      )}
    </div>
  );
});
FilterSection.displayName = "FilterSection";
export default FilterSection;
