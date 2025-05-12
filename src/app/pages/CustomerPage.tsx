import { useState } from 'react';

import ActionSection from '@/features/customer/components/action/ActionSection';
import { CustomersTable } from '@/features/customer/components/table/CustomersTable';
import { ViewCustomerDialog } from '@/features/customer/components/ViewCustomerDialog';
import { useCustomerParams } from '@/features/customer/hooks/useCustomerParams';
import { useCustomers } from '@/features/customer/hooks/useCustomers';
import { Customer } from '@/features/customer/types/customer';

const CustomerPage = () => {
  const { filters, updateFilters } = useCustomerParams();
  const { data, isLoading } = useCustomers(filters);
  
  const [selectedCustomer, setSelectedCustomer] = useState<Customer | null>(null);
  const [isViewOpen, setIsViewOpen] = useState(false);

  const handleSearch = (value: string) => {
    updateFilters({ search: value, page: 1 });
  };

  const handleViewCustomer = (id: number) => {
    const customer = data?.data.result.find((c) => c.id === id);
    if (customer) {
      setSelectedCustomer(customer);
      setIsViewOpen(true);
    }
  };

  const closeViewDialog = () => {
    setIsViewOpen(false);
    setSelectedCustomer(null);
  };

  return (
    <div className="mx-auto px-4 py-6">
      <h1 className="mb-6 text-2xl font-bold">Quản lý khách hàng</h1>
      
      <div className="mb-6">
        <ActionSection handleSearch={handleSearch} />
      </div>
      
      <CustomersTable
        data={data?.data || { result: [], meta: { page: 1, pageSize: 10, pages: 1, total: 0 } }}
        isLoading={isLoading}
        filters={filters}
        updateFilters={updateFilters}
        onView={handleViewCustomer}
      />
      
      {selectedCustomer && isViewOpen && (
        <ViewCustomerDialog
          customer={selectedCustomer}
          isOpen={isViewOpen}
          onClose={closeViewDialog}
        />
      )}
    </div>
  );
};

export default CustomerPage;