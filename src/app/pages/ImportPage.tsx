import { 
  PaginationContent,
  PaginationEllipsis,
  PaginationItem,
  PaginationLink,
  PaginationNext,
  PaginationPrevious,
} from "@/components/ui/pagination-components";
import useImports from "@/features/import/hooks/useImports";
import { useSuppliers } from "@/features/supplier/hooks/useSuppliers";
import ImportTable from "@/features/import/components/table/ImportTable";
import ImportFilter from "@/features/import/components/filter/ImportFilter";
import ActionSection from "@/features/import/components/action/ActionSection";
import { useImportParams } from "@/features/import/hooks/useImportParams";

const ImportPage = () => {
  const { filters, updateFilters } = useImportParams();
  const { suppliers } = useSuppliers();
  const { data: importsData, isLoading, refetch } = useImports(filters);
  
  const handlePageChange = (page: number) => {
    updateFilters({ page });
  };
  
  const imports = importsData?.data?.result || [];
  const meta = importsData?.data?.meta;
  
  return (
    <div className="p-6 space-y-6">
      <div className="flex items-center">
        <h1 className="text-2xl font-bold">Quản lý nhập hàng</h1>
      </div>
      
      <div className="grid grid-cols-7 gap-4">
        <div className="col-span-2">
          <ImportFilter 
            suppliers={suppliers} 
            filters={filters}
            updateFilters={updateFilters}
          />
        </div>
        
        <div className="col-span-5 space-y-6">
          <ActionSection /> 
          <ImportTable 
            imports={imports} 
            isLoading={isLoading} 
            refetch={refetch} 
          />
          
          {meta && meta.pages > 1 && (
            <div className="mt-4">
              <PaginationContent>
                {filters.page! > 1 && (
                  <PaginationItem>
                    <PaginationPrevious 
                      onClick={() => handlePageChange(filters.page! - 1)} 
                      className="cursor-pointer"
                    />
                  </PaginationItem>
                )}
                
                {Array.from({ length: meta.pages }).map((_, index) => {
                  const page = index + 1;
                  // Only show pages near the current page
                  if (
                    page === 1 ||
                    page === meta.pages ||
                    (page >= filters.page! - 1 && page <= filters.page! + 1)
                  ) {
                    return (
                      <PaginationItem key={page}>
                        <PaginationLink
                          onClick={() => handlePageChange(page)}
                          isActive={page === filters.page}
                          className="cursor-pointer"
                        >
                          {page}
                        </PaginationLink>
                      </PaginationItem>
                    );
                  }
                  
                  // Add ellipsis for skipped pages
                  if (
                    (page === filters.page! - 2 && page > 1) ||
                    (page === filters.page! + 2 && page < meta.pages)
                  ) {
                    return (
                      <PaginationItem key={`ellipsis-${page}`}>
                        <PaginationEllipsis />
                      </PaginationItem>
                    );
                  }
                  
                  return null;
                })}
                
                {filters.page! < meta.pages && (
                  <PaginationItem>
                    <PaginationNext 
                      onClick={() => handlePageChange(filters.page! + 1)} 
                      className="cursor-pointer"
                    />
                  </PaginationItem>
                )}
              </PaginationContent>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default ImportPage;