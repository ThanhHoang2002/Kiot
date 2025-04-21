import { ShoppingCart, Search, Plus, RefreshCcw } from 'lucide-react';
import { useState } from 'react';

import { useSellPage } from '../hooks/useSellPage';
import { CustomerDialog } from './customer-dialog/CustomerDialog';
import { PaymentPanel } from './payment-panel/PaymentPanel';
import { ProductList } from './product-list/ProductList';

import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Skeleton } from '@/components/ui/skeleton';
import { Tabs, TabsList, TabsTrigger } from '@/components/ui/tabs';

export function SellPage() {
  const [isCustomerDialogOpen, setIsCustomerDialogOpen] = useState(false);
  
  const {
    activeInvoiceId,
    invoices,
    handleAddInvoice,
    handleSetActiveInvoice,
    handleRemoveInvoice,
    handleSearchChange,
    handleAddToInvoice,
    handleUpdateQuantity,
    handleCustomerSelect,
    handlePayment,
    searchResults,
    searchLoading,
    searchKeyword,
    isProcessingPayment,
  } = useSellPage();
  
  const activeInvoice = invoices.find((invoice) => invoice.id === activeInvoiceId);
  
  return (
    <div className="flex h-[calc(100vh-60px)] flex-col">
      {/* Header with actions */}
      <div className="border-b bg-white p-4 shadow-sm">
        <div className="flex items-center justify-between">
          <h1 className="text-xl font-bold text-gray-800">Bán hàng</h1>
          
          <div className="flex items-center gap-2">
            <Button 
              variant="outline" 
              size="sm"
              onClick={() => handleSearchChange('')}
              className="flex items-center gap-1 text-gray-600 transition-all hover:bg-gray-100"
            >
              <RefreshCcw className="h-4 w-4" />
              Làm mới
            </Button>
            <Button
              variant="default"
              size="sm"
              onClick={handleAddInvoice}
              className="flex items-center gap-1 bg-primary text-primary-foreground shadow-sm transition-all hover:bg-primary/90"
            >
              <Plus className="h-4 w-4" />
              Đơn mới
            </Button>
          </div>
        </div>
      </div>
      
      {/* Main content */}
      <div className="flex flex-1 overflow-hidden">
        {/* Left side - Products */}
        <div className="flex w-2/3 flex-col border-r">
          {/* Tabs and search */}
          <div className="border-b p-4">
            <div className="mb-4 flex items-center gap-2">
              <div className="relative flex-1">
                <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-gray-500" />
                <Input
                  type="text"
                  placeholder="Tìm sản phẩm theo tên, mã, thương hiệu..."
                  className="pl-10"
                  value={searchKeyword}
                  onChange={(e) => handleSearchChange(e.target.value)}
                />
              </div>
            </div>
            
            {/* Invoice tabs */}
            <Tabs
              value={activeInvoiceId}
              onValueChange={handleSetActiveInvoice}
              className="w-full"
            >
              <TabsList className="flex w-full overflow-x-auto">
                {invoices.map((invoice) => (
                  <TabsTrigger
                    key={invoice.id}
                    value={invoice.id}
                    className="relative flex-shrink-0"
                  >
                    <span>Đơn #{invoice.id.slice(-4)}</span>
                    {invoice.items.length > 0 && (
                      <Badge 
                        className="ml-2 bg-primary/20 text-primary hover:bg-primary/30"
                        variant="secondary"
                      >
                        {invoice.items.length}
                      </Badge>
                    )}
                    
                    {invoices.length > 1 && (
                      <button
                        className="absolute -right-1 -top-1 h-4 w-4 rounded-full bg-gray-200 text-xs font-bold text-gray-600 opacity-0 transition-opacity hover:bg-gray-300 group-hover:opacity-100"
                        onClick={(e) => {
                          e.stopPropagation();
                          handleRemoveInvoice(invoice.id);
                        }}
                      >
                        ×
                      </button>
                    )}
                  </TabsTrigger>
                ))}
              </TabsList>
            </Tabs>
          </div>
          
          {/* Search results or product list */}
          <div className="relative flex-1 overflow-auto p-4">
            {searchKeyword ? (
              <>
                {searchLoading ? (
                  <div className="grid grid-cols-2 gap-4 sm:grid-cols-3 md:grid-cols-4">
                    {[...Array(8)].map((_, index) => (
                      <div key={index} className="overflow-hidden rounded-md border bg-white">
                        <Skeleton className="h-28 w-full" />
                        <div className="p-3">
                          <Skeleton className="mb-2 h-4 w-3/4" />
                          <Skeleton className="h-4 w-1/2" />
                        </div>
                      </div>
                    ))}
                  </div>
                ) : searchResults.length > 0 ? (
                  <div className="grid grid-cols-2 gap-4 sm:grid-cols-3 md:grid-cols-4">
                    {searchResults.map((product) => (
                      <div
                        key={product.id}
                        className="group cursor-pointer overflow-hidden rounded-md border bg-white shadow-sm transition-all hover:border-primary hover:shadow-md"
                        onClick={() => handleAddToInvoice(product)}
                      >
                        {product.imageUrl ? (
                          <div className="h-28 overflow-hidden bg-gray-50">
                            <img
                              src={product.imageUrl}
                              alt={product.name}
                              className="h-full w-full object-cover object-center transition-transform group-hover:scale-105"
                            />
                          </div>
                        ) : (
                          <div className="flex h-28 items-center justify-center bg-gray-100">
                            <ShoppingCart className="h-8 w-8 text-gray-400" />
                          </div>
                        )}
                        
                        <div className="p-3">
                          <div className="mb-1 line-clamp-1 font-medium" title={product.name}>
                            {product.name}
                          </div>
                          <div className="flex items-center justify-between">
                            <span className="text-sm text-gray-600">
                              {product.sku}
                            </span>
                            <span className="font-semibold text-primary">
                              {new Intl.NumberFormat('vi-VN', {
                                style: 'currency',
                                currency: 'VND',
                              }).format(product.price)}
                            </span>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                ) : (
                  <div className="flex h-full flex-col items-center justify-center text-center text-gray-500">
                    <Search className="mb-2 h-12 w-12 text-gray-300" />
                    <p className="mb-1 text-lg font-medium">Không tìm thấy sản phẩm</p>
                    <p>Vui lòng thử lại với từ khóa khác</p>
                  </div>
                )}
              </>
            ) : (
              activeInvoice && (
                <ProductList
                  items={activeInvoice.items}
                  onUpdateQuantity={handleUpdateQuantity}
                />
              )
            )}
          </div>
        </div>
        
        {/* Right side - Payment */}
        <div className="w-1/3 p-4">
          <PaymentPanel
            onOpenCustomerDialog={() => setIsCustomerDialogOpen(true)}
            onPayment={handlePayment}
            isProcessingPayment={isProcessingPayment}
          />
        </div>
      </div>
      
      <CustomerDialog
        open={isCustomerDialogOpen}
        onOpenChange={setIsCustomerDialogOpen}
        onSelect={handleCustomerSelect}
      />
    </div>
  );
} 