import ActionSection from "@/features/products/components/action/ActionSection";
import FilterSection from "@/features/products/components/filter/FilterSection";
import { ProductsTable } from "@/features/products/components/table/ProductsTable";
import { useProductsParams } from "@/features/products/hooks/useProductParams";
import { useProducts } from "@/features/products/hooks/useProducts";
import { ProductsResponse } from "@/features/products/types/product";

const Products = () => {
  const { filters, updateFilters } = useProductsParams();
  const { data, isLoading } = useProducts(filters);
  // const [selectedProductId, setSelectedProductId] = useState<number>(0);
  return (
    <div className="grid grid-cols-7 gap-4 px-5">
      <div className="col-span-1"><FilterSection filters={filters} updateFilters={updateFilters} /></div>
      <div className="col-span-6 space-y-8 p-2 pb-10">
        <ActionSection
          handleSearch={(value) => updateFilters({ search: value })}
        />
        <ProductsTable
          data={data?.data as ProductsResponse}
          isLoading={isLoading}
          filters={filters}
          updateFilters={updateFilters}
          handleDeleteSelected={() => console.log("delete")}
        />
      </div>
    </div>
  );
};

export default Products;
