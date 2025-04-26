import { Trash2, PlusCircle, MinusCircle, ShoppingCart } from 'lucide-react';
import React from 'react';

import { TransactionItem } from '../types';

import { Button } from '@/components/ui/button';
import Image from '@/components/ui/image';
import { Input } from '@/components/ui/input';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { cn } from '@/utils/cn';
import { formatCurrency } from '@/utils/format';


interface ProductListProps {
  transaction: {
    id: string;
    items: TransactionItem[];
  } | null;
  onRemoveItem?: (itemId: string) => void;
  onUpdateQuantity?: (itemId: string, quantity: number) => void;
}

export const ProductList = ({
  transaction,
  onRemoveItem,
  onUpdateQuantity,
}: ProductListProps) => {
  const handleRemoveItem = (itemId: string) => {
    if (onRemoveItem) {
      onRemoveItem(itemId);
    }
  };

  const handleIncreaseQuantity = (itemId: string, currentQuantity: number) => {
    if (onUpdateQuantity) {
      onUpdateQuantity(itemId, currentQuantity + 1);
    }
  };

  const handleDecreaseQuantity = (itemId: string, currentQuantity: number) => {
    if (onUpdateQuantity && currentQuantity > 1) {
      onUpdateQuantity(itemId, currentQuantity - 1);
    }
  };

  const handleQuantityChange = (
    e: React.ChangeEvent<HTMLInputElement>,
    itemId: string
  ) => {
    const value = parseInt(e.target.value);
    if (onUpdateQuantity && !isNaN(value) && value > 0) {
      onUpdateQuantity(itemId, value);
    }
  };

  if (!transaction || transaction.items.length === 0) {
    return (
      <div className="flex h-full flex-col items-center justify-center p-8 text-center">
        <div className="mb-4 rounded-full bg-primary/10 p-3">
          <ShoppingCart className="h-8 w-8 text-primary" />
        </div>
        <h3 className="mb-2 text-lg font-medium text-gray-800">Giỏ hàng trống</h3>
        <p className="mb-4 max-w-md text-sm text-gray-500">
          Tìm kiếm và thêm sản phẩm vào giỏ hàng để bắt đầu tạo đơn hàng mới
        </p>
        <div className="flex items-center text-xs text-primary">
          <PlusCircle className="mr-1 h-3 w-3" />
          <span>Sử dụng thanh tìm kiếm phía trên để thêm sản phẩm</span>
        </div>
      </div>
    );
  }

  return (
    <div className="flex h-full flex-col">
      <Table>
        <TableHeader className="bg-gray-50/80">
          <TableRow className="hover:bg-gray-50/80">
            <TableHead className="w-[50%]">Sản phẩm</TableHead>
            <TableHead className="text-center">SL</TableHead>
            <TableHead className="text-right">Đơn giá</TableHead>
            <TableHead className="text-right">Thành tiền</TableHead>
            <TableHead className="w-[50px]"></TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {transaction.items.map((item) => (
            <TableRow 
              key={item.id} 
              className="group border-b border-gray-100 transition-colors hover:bg-gray-50/80"
            >
              <TableCell className="font-medium">
                <div className='justify-cente flex items-center space-x-3'>
                  <Image containerClassName='h-16 w-16 r' src={item.imageUrl} />
                  <div className="flex text-center text-sm font-medium text-gray-800">{item.name}</div>
               </div>
              </TableCell>
              <TableCell className="text-center">
                <div className="flex items-center justify-center space-x-1">
                  {onUpdateQuantity ? (
                    <>
                      <Button
                        variant="ghost"
                        size="icon"
                        className={cn(
                          "h-7 w-7 rounded-full text-gray-500 transition-colors hover:bg-primary/10 hover:text-primary",
                          item.quantity <= 1 && "cursor-not-allowed opacity-50"
                        )}
                        onClick={() => handleDecreaseQuantity(item.id, item.quantity)}
                        disabled={item.quantity <= 1}
                      >
                        <MinusCircle className="h-4 w-4" />
                        <span className="sr-only">Giảm</span>
                      </Button>
                      <Input
                        type="number"
                        min="1"
                        value={item.quantity}
                        onChange={(e) => handleQuantityChange(e, item.id)}
                        className="h-8 w-14 text-center [appearance:textfield] [&::-webkit-inner-spin-button]:appearance-none [&::-webkit-outer-spin-button]:appearance-none"
                      />
                      <Button
                        variant="ghost"
                        size="icon"
                        onClick={() => handleIncreaseQuantity(item.id, item.quantity)}
                        className="h-7 w-7 rounded-full text-gray-500 transition-colors hover:bg-primary/10 hover:text-primary"
                      >
                        <PlusCircle className="h-4 w-4" />
                        <span className="sr-only">Tăng</span>
                      </Button>
                    </>
                  ) : (
                    <span>{item.quantity}</span>
                  )}
                </div>
              </TableCell>
              <TableCell className="text-right tabular-nums">
                {formatCurrency(item.price)}
              </TableCell>
              <TableCell className="text-right font-medium tabular-nums">
                {formatCurrency(item.price * item.quantity)}
              </TableCell>
              <TableCell>
                {onRemoveItem && (
                  <Button
                    variant="ghost"
                    size="icon"
                    onClick={() => handleRemoveItem(item.id)}
                    className="h-8 w-8 text-gray-500 opacity-0 transition-opacity duration-200 hover:bg-red-50 hover:text-red-600 group-hover:opacity-100"
                  >
                    <Trash2 className="h-4 w-4" />
                    <span className="sr-only">Xóa</span>
                  </Button>
                )}
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </div>
  );
}; 