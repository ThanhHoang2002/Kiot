import { Phone, Plus, Search, User, UserPlus, DownloadIcon } from 'lucide-react';
import { useCallback, useEffect, useState } from 'react';

import { useCustomerSearch } from '../hooks/useCustomerSearch';
import { useDebounce } from '../hooks/useDebounce';
import { Customer, CustomerApiData } from '../types';

import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from '@/components/ui/popover';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { toast } from '@/hooks/use-toast';
import { cn } from '@/utils/cn';

interface CustomerPopoverProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onSelect: (customer: Customer) => void;
  children: React.ReactNode;
}

export const CustomerPopover = ({ open, onOpenChange, onSelect, children }: CustomerPopoverProps) => {
  const [activeTab, setActiveTab] = useState<'search' | 'create'>('search');
  const [searchTerm, setSearchTerm] = useState('');
  const [newCustomer, setNewCustomer] = useState({
    fullname: '',
    phone: '',
  });
  
  // Reset state when popover opens
  useEffect(() => {
    if (open) {
      setSearchTerm('');
      setNewCustomer({ fullname: '', phone: '' });
      setActiveTab('search');
    }
  }, [open]);
  
  const debouncedSearchTerm = useDebounce(searchTerm, 300);
  const { 
    data, 
    isLoading, 
    error, 
    fetchNextPage, 
    hasNextPage, 
    isFetchingNextPage
  } = useCustomerSearch(debouncedSearchTerm);
  
  const handleSearchChange = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
    setSearchTerm(e.target.value);
  }, []);
  
  const handleNewCustomerChange = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setNewCustomer(prev => ({ ...prev, [name]: value }));
  }, []);
  
  const handleSelectCustomer = useCallback((customer: CustomerApiData) => {
    onSelect({
      id: customer.id,
      name: customer.fullname,
      phone: customer.phone,
    });
    onOpenChange(false);
  }, [onSelect, onOpenChange]);
  
  const handleCreateCustomer = useCallback(() => {
    // Validate inputs
    if (!newCustomer.fullname.trim() || !newCustomer.phone.trim()) {
      toast({
        title: "Lỗi",
        description: "Vui lòng nhập đầy đủ thông tin khách hàng",
        variant: "destructive"
      });
      return;
    }
    
    // In production, you'd call an API here to create the customer
    // For now, we'll simulate by creating a local customer object
    const customer: Customer = {
      id: Date.now(), // Temporary ID for simulation
      name: newCustomer.fullname,
      phone: newCustomer.phone,
    };
    
    onSelect(customer);
    onOpenChange(false);
    
    toast({
      title: "Thành công",
      description: "Đã tạo khách hàng mới thành công",
    });
  }, [newCustomer, onSelect, onOpenChange]);
  
  const isPhoneValid = /^\d{8,12}$/.test(newCustomer.phone);
  const canCreateCustomer = newCustomer.fullname.trim().length > 0 && isPhoneValid;

  // Tập hợp tất cả các khách hàng từ kết quả phân trang
  const allCustomers = data?.pages.flatMap(page => 
    page.data?.result || []
  ) || [];
  
  const hasCustomers = allCustomers.length > 0;
  
  return (
    <Popover open={open} onOpenChange={onOpenChange}>
      <PopoverTrigger asChild>
        {children}
      </PopoverTrigger>
      <PopoverContent 
        className="w-[425px] p-0" 
        align="start"
        side="top"
        alignOffset={-500}
        sideOffset={-140}
      >
        <div className="space-y-4 p-4">
          <div className="space-y-2">
            <h3 className="text-lg font-medium">Khách hàng</h3>
            <p className="text-sm text-muted-foreground">
              Tìm kiếm hoặc tạo mới khách hàng cho đơn hàng
            </p>
          </div>
          
          <Tabs 
            value={activeTab} 
            onValueChange={(v) => setActiveTab(v as 'search' | 'create')}
            className="w-full"
          >
            <TabsList className="grid w-full grid-cols-2">
              <TabsTrigger value="search" className="flex items-center gap-2">
                <Search className="h-4 w-4" />
                Tìm kiếm
              </TabsTrigger>
              <TabsTrigger value="create" className="flex items-center gap-2">
                <UserPlus className="h-4 w-4" />
                Tạo mới
              </TabsTrigger>
            </TabsList>
            
            <TabsContent value="search" className="space-y-4 py-4">
              <div className="relative">
                <div className="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-3">
                  <Phone className="h-4 w-4 text-gray-400" />
                </div>
                <Input
                  placeholder="Tìm kiếm theo số điện thoại hoặc tên"
                  value={searchTerm}
                  onChange={handleSearchChange}
                  className="pl-10"
                />
              </div>
              
              <div className="max-h-[300px] overflow-y-auto rounded-md border border-gray-200">
                {isLoading ? (
                  <div className="p-4 text-center text-gray-500">Đang tìm kiếm...</div>
                ) : error ? (
                  <div className="p-4 text-center text-red-500">Có lỗi xảy ra khi tìm kiếm</div>
                ) : !hasCustomers ? (
                  <div className="flex flex-col items-center justify-center p-6 text-center">
                    <User className="mb-2 h-8 w-8 text-gray-300" />
                    <p className="mb-1 text-gray-600">Không tìm thấy khách hàng</p>
                    <Button
                      variant="link"
                      onClick={() => setActiveTab('create')}
                      className="mt-2 text-sm text-blue-600"
                    >
                      Tạo khách hàng mới
                    </Button>
                  </div>
                ) : (
                  <>
                    <ul className="divide-y divide-gray-200">
                      {allCustomers.map((customer: CustomerApiData) => (
                        <li
                          key={customer.id}
                          className="cursor-pointer p-3 hover:bg-gray-50"
                          onClick={() => handleSelectCustomer(customer)}
                        >
                          <div className="flex items-center justify-between">
                            <div className="flex items-center space-x-3">
                              <div
                                className={cn(
                                  "flex h-9 w-9 items-center justify-center rounded-full",
                                  "bg-primary/10 text-primary"
                                )}
                              >
                                <User className="h-5 w-5" />
                              </div>
                              <div>
                                <p className="font-medium">{customer.fullname}</p>
                                <p className="text-sm text-gray-500">{customer.phone}</p>
                              </div>
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
                    
                    {hasNextPage && (
                      <div className="flex justify-center border-t p-2">
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => fetchNextPage()}
                          disabled={isFetchingNextPage}
                          className="w-full text-sm text-muted-foreground"
                        >
                          {isFetchingNextPage ? (
                            "Đang tải thêm..."
                          ) : (
                            <>
                              <DownloadIcon className="mr-2 h-4 w-4" />
                              Tải thêm
                            </>
                          )}
                        </Button>
                      </div>
                    )}
                  </>
                )}
              </div>
            </TabsContent>
            
            <TabsContent value="create" className="space-y-4 py-4">
              <div className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="fullname">Tên khách hàng <span className="text-red-500">*</span></Label>
                  <Input
                    id="fullname"
                    name="fullname"
                    placeholder="Nhập tên khách hàng"
                    value={newCustomer.fullname}
                    onChange={handleNewCustomerChange}
                  />
                </div>
                
                <div className="space-y-2">
                  <Label htmlFor="phone">Số điện thoại <span className="text-red-500">*</span></Label>
                  <div className="relative">
                    <div className="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-3">
                      <Phone className="h-4 w-4 text-gray-400" />
                    </div>
                    <Input
                      id="phone"
                      name="phone"
                      placeholder="Nhập số điện thoại"
                      value={newCustomer.phone}
                      onChange={handleNewCustomerChange}
                      className="pl-10"
                    />
                  </div>
                  {newCustomer.phone && !isPhoneValid && (
                    <p className="text-sm text-red-500">Số điện thoại phải có 8-12 chữ số</p>
                  )}
                </div>
              </div>
              
              <div className="rounded-md bg-blue-50 p-3 text-sm text-blue-700">
                <p>Lưu ý: Chỉ cần nhập tên và số điện thoại là có thể tạo khách hàng mới</p>
              </div>
            </TabsContent>
          </Tabs>
          
          <div className="flex justify-between pt-4">
            <Button 
              variant="outline" 
              onClick={() => onOpenChange(false)}
              size="sm"
            >
              Hủy
            </Button>
            
            {activeTab === 'create' && (
              <Button
                onClick={handleCreateCustomer}
                disabled={!canCreateCustomer}
                size="sm"
              >
                <Plus className="mr-2 h-4 w-4" />
                Tạo khách hàng
              </Button>
            )}
          </div>
        </div>
      </PopoverContent>
    </Popover>
  );
}; 