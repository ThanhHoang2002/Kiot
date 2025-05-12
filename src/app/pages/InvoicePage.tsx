import { FilePlus, Filter } from 'lucide-react';
import { useState, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';

import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { PageHeader } from '@/components/ui/page-header';
import { Skeleton } from '@/components/ui/skeleton';
import { InvoiceDetailDialog } from '@/features/invoice/components/InvoiceDetailDialog';
import InvoiceFilter from '@/features/invoice/components/InvoiceFilter';
import InvoicePagination from '@/features/invoice/components/InvoicePagination';
import InvoiceTable from '@/features/invoice/components/InvoiceTable';
import { useInvoiceParams } from '@/features/invoice/hooks/useInvoiceParams';
import { useInvoices } from '@/features/invoice/hooks/useInvoices';
import { Invoice, InvoiceFilterParams } from '@/features/invoice/types/invoice';

const InvoicePage = () => {
  const navigate = useNavigate();
  const { filters, updateFilters } = useInvoiceParams();
  const [showFilterMobile, setShowFilterMobile] = useState(false);
  
  // State for dialog
  const [isDetailOpen, setIsDetailOpen] = useState(false);
  const [selectedInvoiceId, setSelectedInvoiceId] = useState<number | null>(null);
  
  const { data, isLoading, isFetching } = useInvoices(filters);
  
  // Fetch invoice details when ID is selected
  // Tạm thời comment lại cho tới khi hook useInvoiceById được triển khai hoàn chỉnh
  // const { 
  //   data: invoiceDetail
  // } = useInvoiceById(selectedInvoiceId || 0, {
  //   enabled: selectedInvoiceId !== null
  // });
  
  // Tạm thời sử dụng dữ liệu từ useInvoices
  const invoiceDetail = data;
  
  const invoices = data?.data.result || [];
  const pagination = data?.data.meta;

  const handleFilterChange = useCallback((newFilters: Partial<InvoiceFilterParams>) => {
    updateFilters(newFilters);
  }, [updateFilters]);

  const handlePageChange = useCallback((page: number) => {
    updateFilters({ page });
  }, [updateFilters]);

  const handleViewDetails = useCallback((id: number) => {
    setSelectedInvoiceId(id);
    setIsDetailOpen(true);
  }, []);

  const handleCloseDetail = useCallback(() => {
    setIsDetailOpen(false);
    setSelectedInvoiceId(null);
  }, []);

  const handleCreateInvoice = useCallback(() => {
    navigate('/transaction'); // Chuyển đến trang bán hàng
  }, [navigate]);

  const toggleFilterMobile = useCallback(() => {
    setShowFilterMobile(prev => !prev);
  }, []);

  // Check if loading
  const showSkeleton = isLoading && !data;
  const currentPage = pagination?.page || 1;
  const totalPages = pagination?.pages || 1;

  const headerActions = (
    <div className="flex items-center gap-2">
      <Button 
        variant="default" 
        className="gap-2" 
        onClick={handleCreateInvoice}
      >
        <FilePlus className="h-4 w-4" />
        <span className="hidden sm:inline">Thêm hóa đơn</span>
      </Button>
      <Button
        variant="ghost"
        size="icon"
        className="md:hidden"
        onClick={toggleFilterMobile}
      >
        <Filter className="h-4 w-4" />
      </Button>
    </div>
  );

  // Extract selected invoice details if available
  const selectedInvoice = invoiceDetail?.data?.result?.find((invoice: Invoice) => invoice.id === selectedInvoiceId);

  return (
    <div className="mx-auto px-4 py-6">
      <PageHeader 
        title="Quản lý hóa đơn"
        subtitle="Xem và quản lý danh sách hóa đơn trong hệ thống."
        actions={headerActions}
      />

      <div className="mt-6 grid grid-cols-1 gap-6 md:grid-cols-4">
        {/* Filter - Responsive */}
        <div className={`md:block ${showFilterMobile ? 'block' : 'hidden'}`}>
          <div className="sticky top-20">
            <InvoiceFilter 
              onFilter={handleFilterChange}
              defaultValues={filters}
            />
          </div>
        </div>

        {/* Table */}
        <div className="md:col-span-3">
          {showSkeleton ? (
            <Card className="p-6">
              <div className="space-y-3">
                <Skeleton className="h-10 w-full" />
                <Skeleton className="h-10 w-full" />
                <Skeleton className="h-10 w-full" />
                <Skeleton className="h-10 w-full" />
                <Skeleton className="h-10 w-full" />
              </div>
            </Card>
          ) : (
            <InvoiceTable 
              invoices={invoices}
              onViewDetails={handleViewDetails}
              isLoading={isFetching && !showSkeleton}
            />
          )}

          <div className="mt-4 flex justify-center">
            <InvoicePagination
              currentPage={currentPage}
              totalPages={totalPages}
              onPageChange={handlePageChange}
            />
          </div>
        </div>
      </div>

      {/* Detail Dialog */}
      {selectedInvoice && (
        <InvoiceDetailDialog
          invoice={selectedInvoice}
          isOpen={isDetailOpen}
          onClose={handleCloseDetail}
        />
      )}
    </div>
  );
};

export default InvoicePage;