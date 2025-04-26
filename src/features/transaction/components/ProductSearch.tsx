import { ImageOff, Search } from 'lucide-react';
import { ChangeEvent, useCallback, useEffect, useRef, useState } from 'react';

import { useDebounce } from '../hooks/useDebounce';
import { useProductSearch } from '../hooks/useProductSearch';
import { useTransactionStore } from '../store/transactionStore';

import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Product } from '@/features/products/types/product';

export const ProductSearch = () => {
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const dropdownRef = useRef<HTMLUListElement>(null);
  const { searchKeyword, setSearchKeyword, addProductToTransaction } = useTransactionStore();
  
  const debouncedSearchTerm = useDebounce(searchKeyword, 300);
  const { 
    data,
    isLoading, 
    error,
    fetchNextPage,
    hasNextPage,
    isFetchingNextPage
  } = useProductSearch(debouncedSearchTerm);
  
  const handleSearchChange = useCallback((e: ChangeEvent<HTMLInputElement>) => {
    setSearchKeyword(e.target.value);
    setIsDropdownOpen(true);
  }, [setSearchKeyword]);
  
  const handleAddProduct = useCallback((product: Product) => {
    addProductToTransaction(product);
    setIsDropdownOpen(false);
  }, [addProductToTransaction]);
  
  // Close dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = () => setIsDropdownOpen(false);
    
    document.addEventListener('click', handleClickOutside);
    return () => document.removeEventListener('click', handleClickOutside);
  }, []);
  
  // Handle scroll event for infinite loading
  const handleScroll = useCallback(() => {
    if (!dropdownRef.current) return;
    
    const { scrollTop, scrollHeight, clientHeight } = dropdownRef.current;
    // Khi người dùng scroll đến gần cuối danh sách (còn cách 20px)
    if (scrollTop + clientHeight >= scrollHeight - 20 && !isFetchingNextPage && hasNextPage) {
      fetchNextPage();
    }
  }, [fetchNextPage, hasNextPage, isFetchingNextPage]);
  
  // Open dropdown when results are available
  useEffect(() => {
    const hasResults = data?.pages[0]?.data && data.pages[0].data.result.length > 0;
    if (hasResults && searchKeyword) {
      setIsDropdownOpen(true);
    }
  }, [data, searchKeyword]);
  
  // Tổng hợp tất cả sản phẩm từ tất cả các trang
  const allProducts = data?.pages.flatMap(page => page.data.result) || [];
  
  return (
    <div className="relative w-full">
      <div className="flex w-full items-center space-x-2">
        <div className="relative flex-grow">
          <div className="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-3">
            <Search className="h-4 w-4 text-gray-400" />
          </div>
          
          <Input
            value={searchKeyword}
            onChange={handleSearchChange}
            onClick={(e) => {
              e.stopPropagation();
              const hasResults = data?.pages[0]?.data && data.pages[0].data.result.length > 0;
              if (hasResults) {
                setIsDropdownOpen(true);
              }
            }}
            placeholder="Tìm kiếm sản phẩm..."
            className="pl-10"
          />
        </div>
      </div>
      
      {isDropdownOpen && (
        <div className="absolute z-50 mt-1 w-full rounded-md border border-gray-200 bg-white shadow-lg">
          {isLoading && !data ? (
            <div className="p-4 text-center text-gray-500">Đang tìm kiếm...</div>
          ) : error ? (
            <div className="p-4 text-center text-red-500">Có lỗi xảy ra khi tìm kiếm</div>
          ) : !allProducts.length ? (
            <div className="p-4 text-center text-gray-500">Không tìm thấy sản phẩm</div>
          ) : (
            <ul 
              className="max-h-64 overflow-auto py-2"
              ref={dropdownRef}
              onScroll={handleScroll}
            >
              {allProducts.map((product: Product) => (
                <li
                  key={product.id}
                  className="cursor-pointer px-4 py-2 hover:bg-gray-100"
                  onClick={(e) => {
                    e.stopPropagation();
                    handleAddProduct(product);
                  }}
                >
                  <div className="flex items-center gap-3">
                    {/* Hình ảnh sản phẩm */}
                    <div className="relative h-12 w-12 flex-shrink-0 overflow-hidden rounded-md border border-gray-200">
                      {product.image ? (
                        <img
                          src={product.image}
                          alt={product.name}
                          className="h-full w-full object-cover"
                          onError={(e) => {
                            const target = e.currentTarget as HTMLImageElement;
                            target.style.display = 'none';
                            const fallback = target.parentElement?.querySelector('.fallback-icon') as HTMLElement;
                            if (fallback) {
                              fallback.style.display = 'flex';
                            }
                          }}
                        />
                      ) : (
                        <div className="flex h-full w-full items-center justify-center bg-gray-100">
                          <ImageOff className="h-4 w-4 text-gray-400" />
                        </div>
                      )}
                      <div className="fallback-icon absolute inset-0 hidden items-center justify-center bg-gray-100">
                        <ImageOff className="h-4 w-4 text-gray-400" />
                      </div>
                    </div>

                    {/* Thông tin sản phẩm */}
                    <div className="flex flex-1 items-center justify-between">
                      <div>
                        <div className="line-clamp-1 font-medium">{product.name}</div>
                        <div className="text-sm text-gray-500">Mã: {product.id}</div>
                      </div>
                      <div className="flex items-center space-x-2">
                        <Badge variant="outline" className="bg-blue-50">
                          {new Intl.NumberFormat('vi-VN', { style: 'currency', currency: 'VND' }).format(product.sellPrice)}
                        </Badge>
                        <Badge variant="outline" className="bg-green-50">
                          SL: {product.quantity}
                        </Badge>
                        <Button 
                          size="sm" 
                          onClick={(e) => {
                            e.stopPropagation();
                            handleAddProduct(product);
                          }}
                        >
                          Thêm
                        </Button>
                      </div>
                    </div>
                  </div>
                </li>
              ))}
              
              {isFetchingNextPage && (
                <li className="px-4 py-2 text-center text-sm text-gray-500">
                  Đang tải thêm sản phẩm...
                </li>
              )}
            </ul>
          )}
        </div>
      )}
    </div>
  );
};