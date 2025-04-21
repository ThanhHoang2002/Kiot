import { Minus, Plus, ShoppingCart, Trash2, ImageOff } from 'lucide-react';
import { useCallback } from 'react';

import { useTransactionStore } from '../store/transactionStore';

import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';

export const ProductList = () => {
  const { 
    getActiveTransaction, 
    removeProductFromTransaction, 
    updateProductQuantity 
  } = useTransactionStore();
  
  const transaction = getActiveTransaction();
  
  const handleRemoveItem = useCallback((productId: number) => {
    removeProductFromTransaction(productId);
  }, [removeProductFromTransaction]);
  
  const handleQuantityChange = useCallback((productId: number, quantity: number) => {
    updateProductQuantity(productId, quantity);
  }, [updateProductQuantity]);
  
  const handleIncreaseQuantity = useCallback((productId: number, currentQuantity: number) => {
    updateProductQuantity(productId, currentQuantity + 1);
  }, [updateProductQuantity]);
  
  const handleDecreaseQuantity = useCallback((productId: number, currentQuantity: number) => {
    if (currentQuantity > 1) {
      updateProductQuantity(productId, currentQuantity - 1);
    }
  }, [updateProductQuantity]);
  
  if (!transaction || transaction.items.length === 0) {
    return (
      <div className="flex h-full flex-col items-center justify-center rounded-md border border-dashed border-gray-300 bg-gray-50/50 p-8 text-center">
        <ShoppingCart className="mb-4 h-12 w-12 text-gray-400" />
        <div className="space-y-2">
          <p className="text-base font-medium text-gray-600">Chưa có sản phẩm trong đơn hàng</p>
          <p className="text-sm text-gray-500">Nhập tên sản phẩm vào ô tìm kiếm phía trên để bắt đầu</p>
          <p className="text-xs text-gray-400">Hoặc quét mã vạch sản phẩm để thêm nhanh</p>
        </div>
      </div>
    );
  }
  
  return (
    <div className="overflow-hidden rounded-md border border-gray-200">
      <Table>
        <TableHeader className="bg-gray-50">
          <TableRow>
            <TableHead className="w-[60px]"></TableHead>
            <TableHead>Sản phẩm</TableHead>
            <TableHead className="w-[100px]">Số lượng</TableHead>
            <TableHead className="w-[100px] text-right">Đơn giá</TableHead>
            <TableHead className="w-[100px] text-right">Thành tiền</TableHead>
            <TableHead className="w-[40px]"></TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {transaction.items.map((item, index) => (
            <TableRow 
              key={item.id}
              className="group transition-colors hover:bg-blue-50/30"
              data-is-new={index === transaction.items.length - 1 ? "true" : "false"}
            >
              <TableCell className="p-2">
                <div className="relative h-10 w-10 overflow-hidden rounded-md border border-gray-200">
                  {item.imageUrl ? (
                    <>
                      <img
                        src={item.imageUrl}
                        alt={item.name}
                        className="h-full w-full object-cover"
                        onError={(e) => {
                          const target = e.currentTarget as HTMLImageElement;
                          target.onerror = null;
                          target.style.display = 'none';
                          const fallback = target.parentElement?.querySelector('.fallback-icon') as HTMLElement;
                          if (fallback) {
                            fallback.style.display = 'flex';
                          }
                        }}
                      />
                      <div className="fallback-icon absolute inset-0 hidden items-center justify-center bg-gray-100">
                        <ImageOff className="h-4 w-4 text-gray-400" />
                      </div>
                    </>
                  ) : (
                    <div className="flex h-full w-full items-center justify-center bg-gray-100">
                      <ImageOff className="h-4 w-4 text-gray-400" />
                    </div>
                  )}
                </div>
              </TableCell>
              <TableCell className="font-medium">
                <div>
                  <div className="line-clamp-1">{item.name}</div>
                  <div className="text-xs text-gray-500">Mã: {item.productId}</div>
                </div>
              </TableCell>
              <TableCell>
                <div className="flex items-center space-x-1">
                  <Button
                    variant="outline"
                    size="icon"
                    className="h-7 w-7 transition-colors hover:bg-red-50"
                    onClick={() => handleDecreaseQuantity(item.productId, item.quantity)}
                    disabled={item.quantity <= 1}
                  >
                    <Minus className="h-3 w-3" />
                  </Button>
                  
                  <Input
                    type="number"
                    min="1"
                    value={item.quantity}
                    onChange={(e) => {
                      const value = parseInt(e.target.value);
                      if (!isNaN(value) && value > 0) {
                        handleQuantityChange(item.productId, value);
                      }
                    }}
                    className="h-7 w-16 text-center focus:border-blue-500 focus:ring-blue-500"
                  />
                  
                  <Button
                    variant="outline"
                    size="icon"
                    className="h-7 w-7 transition-colors hover:bg-green-50"
                    onClick={() => handleIncreaseQuantity(item.productId, item.quantity)}
                  >
                    <Plus className="h-3 w-3" />
                  </Button>
                </div>
              </TableCell>
              <TableCell className="text-right">
                {new Intl.NumberFormat('vi-VN', { style: 'currency', currency: 'VND' }).format(item.price)}
              </TableCell>
              <TableCell className="text-right font-medium">
                {new Intl.NumberFormat('vi-VN', { style: 'currency', currency: 'VND' }).format(item.total)}
              </TableCell>
              <TableCell>
                <Button
                  variant="ghost"
                  size="icon"
                  onClick={() => handleRemoveItem(item.productId)}
                  className="invisible h-7 w-7 text-red-500 transition-all hover:bg-red-50 hover:text-red-600 group-hover:visible"
                >
                  <Trash2 className="h-4 w-4" />
                </Button>
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </div>
  );
}; 