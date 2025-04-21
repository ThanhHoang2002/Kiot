import { User } from 'lucide-react';
import { ChangeEvent, useCallback, useEffect, useState } from 'react';

import { useCustomerByPhone, useCustomerSearch } from '../hooks/useCustomerSearch';
import { useDebounce } from '../hooks/useDebounce';
import { useTransactionStore } from '../store/transactionStore';
import { Customer } from '../types';

import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';

export const CustomerSearch = () => {
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const { customerKeyword, setCustomerKeyword, setTransactionCustomer } = useTransactionStore();
  
  const debouncedSearchTerm = useDebounce(customerKeyword, 300);
  
  // Search by keyword (name or general info)
  const { data: searchResults, isLoading: isSearchLoading } = useCustomerSearch(debouncedSearchTerm);
  
  // If the term looks like a phone number, also try to search by phone specifically
  const isPhoneSearch = /^\d+$/.test(debouncedSearchTerm);
  const { data: phoneCustomer, isLoading: isPhoneLoading } = useCustomerByPhone(
    isPhoneSearch ? debouncedSearchTerm : ''
  );
  
  const handleSearchChange = useCallback((e: ChangeEvent<HTMLInputElement>) => {
    setCustomerKeyword(e.target.value);
    setIsDropdownOpen(true);
  }, [setCustomerKeyword]);
  
  const handleSelectCustomer = useCallback((customer: Customer) => {
    setTransactionCustomer(customer);
    setCustomerKeyword(''); // Clear search after selection
    setIsDropdownOpen(false);
  }, [setTransactionCustomer, setCustomerKeyword]);
  
  // Show dropdown when results are available
  useEffect(() => {
    const hasResults = searchResults?.data && searchResults.data.length > 0;
    if ((hasResults || phoneCustomer) && customerKeyword && customerKeyword.length > 0) {
      setIsDropdownOpen(true);
    } else if (customerKeyword.length === 0) {
      setIsDropdownOpen(false);
    }
  }, [searchResults, phoneCustomer, customerKeyword]);
  
  // Close dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = () => setIsDropdownOpen(false);
    
    document.addEventListener('click', handleClickOutside);
    return () => document.removeEventListener('click', handleClickOutside);
  }, []);
  
  return (
    <div className="relative w-full">
      <div className="flex w-full items-center space-x-2">
        <div className="relative flex-grow">
          <div className="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-3">
            <User className="h-4 w-4 text-gray-400" />
          </div>
          
          <Input
            value={customerKeyword}
            onChange={handleSearchChange}
            onClick={(e) => {
              e.stopPropagation();
              if (customerKeyword && customerKeyword.length > 0) {
                setIsDropdownOpen(true);
              }
            }}
            placeholder="Tìm kiếm khách hàng theo tên hoặc số điện thoại"
            className="pl-10"
          />
        </div>
      </div>
      
      {isDropdownOpen && (
        <div className="absolute z-50 mt-1 w-full rounded-md border border-gray-200 bg-white shadow-lg">
          {isSearchLoading || isPhoneLoading ? (
            <div className="p-4 text-center text-gray-500">Đang tìm kiếm...</div>
          ) : phoneCustomer ? (
            <div className="border-b p-3" onClick={(e) => e.stopPropagation()}>
              <div className="flex items-center justify-between">
                <div>
                  <div className="font-medium">{phoneCustomer.name}</div>
                  <div className="text-sm text-gray-500">{phoneCustomer.phone}</div>
                  {phoneCustomer.address && (
                    <div className="text-xs text-gray-400">{phoneCustomer.address}</div>
                  )}
                </div>
                <Button 
                  size="sm" 
                  onClick={() => handleSelectCustomer(phoneCustomer)}
                >
                  Chọn
                </Button>
              </div>
            </div>
          ) : null}
          
          {searchResults?.data && searchResults.data.length > 0 ? (
            <ul className="max-h-64 overflow-auto py-2">
              {searchResults.data.map((customer) => (
                <li
                  key={customer.id}
                  className="cursor-pointer px-4 py-2 hover:bg-gray-100"
                  onClick={(e) => {
                    e.stopPropagation();
                    handleSelectCustomer(customer);
                  }}
                >
                  <div className="flex items-center justify-between">
                    <div>
                      <div className="font-medium">{customer.name}</div>
                      <div className="text-sm text-gray-500">{customer.phone}</div>
                      {customer.address && (
                        <div className="text-xs text-gray-400">{customer.address}</div>
                      )}
                    </div>
                    <Button 
                      size="sm" 
                      onClick={(e) => {
                        e.stopPropagation();
                        handleSelectCustomer(customer);
                      }}
                    >
                      Chọn
                    </Button>
                  </div>
                </li>
              ))}
            </ul>
          ) : !phoneCustomer && !isSearchLoading && !isPhoneLoading && customerKeyword ? (
            <div className="p-4 text-center text-gray-500">
              Không tìm thấy khách hàng
            </div>
          ) : null}
        </div>
      )}
    </div>
  );
}; 