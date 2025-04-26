import { CircleDollarSign, CreditCard, Loader2, Receipt, ShoppingBag, Gift, TrendingUp, User } from 'lucide-react';
import React from 'react';

import { useTransactionStore } from '../store/transactionStore';
import { PaymentMethod } from '../types';

import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardFooter, CardHeader } from '@/components/ui/card';
import { cn } from '@/utils/cn';

interface PaymentPanelProps {
  onPayment?: () => void;
  isProcessingPayment?: boolean;
  customerSelector?: React.ReactNode;
}

export const PaymentPanel = ({
  onPayment,
  isProcessingPayment = false,
  customerSelector,
}: PaymentPanelProps) => {
  const {
    getActiveTransaction,
    setPaymentMethod,
  } = useTransactionStore();
  
  const transaction = getActiveTransaction();
  
  const handlePaymentMethodChange = (method: PaymentMethod) => {
    setPaymentMethod(method);
  };
  
  const handlePayment = () => {
    if (onPayment) {
      onPayment();
    }
  };
  
  if (!transaction) {
    return (
      <Card className="flex h-full flex-col items-center justify-center p-6 text-center">
        <Receipt className="mb-4 h-12 w-12 text-gray-400" />
        <h3 className="mb-2 text-lg font-medium text-gray-700">Không có đơn hàng</h3>
        <p className="text-sm text-gray-500">Vui lòng tạo đơn hàng mới để tiếp tục</p>
      </Card>
    );
  }
  
  // Tính tổng số sản phẩm
  const totalItems = transaction.items.reduce((sum, item) => sum + item.quantity, 0);
  
  return (
    <Card className="flex h-full flex-col overflow-hidden border-gray-200 shadow-sm">
      <CardHeader className="bg-primary/5 pb-3 pt-4">
        <div className="flex items-center justify-between">
          <h3 className="text-base font-semibold text-primary">Thông tin thanh toán</h3>
          <Badge variant="outline" className="border-primary/30 bg-primary/10 text-primary">
            {transaction.id}
          </Badge>
        </div>
      </CardHeader>
      
      <CardContent className="flex-1 space-y-5 px-4 py-4">
        {/* Customer selection with improved styling */}
        {customerSelector && (
          <div className="rounded-lg border border-gray-200 bg-gray-50/40 p-3 transition-all hover:border-gray-300">
            <div className="mb-2 flex items-center">
              <User className="mr-2 h-4 w-4 text-primary" />
              <span className="text-sm font-medium text-gray-700">Thông tin khách hàng</span>
            </div>
            {customerSelector}
          </div>
        )}
        
        {/* Payment details with improved spacing and hierarchy */}
        <div className="space-y-4">
          {/* Thông tin đơn hàng với visual enhancements */}
          <div className="rounded-lg border border-gray-200 p-4 shadow-sm transition-all hover:border-gray-300">
            <div className="mb-3 flex items-center text-sm font-medium text-gray-700">
              <ShoppingBag className="mr-2 h-4 w-4 text-gray-600" />
              <span>Thông tin đơn hàng</span>
            </div>
            
            <div className="space-y-3">
              <div className="flex items-center justify-between pb-2">
                <div className="flex items-center text-gray-600">
                  <span>Tổng số sản phẩm:</span>
                </div>
                <span className="font-medium text-gray-800">{totalItems} sản phẩm</span>
              </div>
              
              <div className="flex items-center justify-between border-t pt-2 text-base">
                <span className="font-medium text-gray-700">Tổng tiền hàng:</span>
                <span className="text-lg font-bold text-emerald-600">
                  {new Intl.NumberFormat('vi-VN', { style: 'currency', currency: 'VND' }).format(transaction.subtotal)}
                </span>
              </div>
            </div>
          </div>
          
          {/* Phương thức thanh toán với visual improvements */}
          <div className="rounded-lg border border-gray-200 p-4 shadow-sm transition-all hover:border-gray-300">
            <div className="mb-3 text-sm font-medium text-gray-700">Phương thức thanh toán:</div>
            <div className="grid grid-cols-2 gap-3">
              <Button
                type="button"
                variant="outline"
                className={cn(
                  "h-auto w-full py-3 transition-all",
                  transaction.paymentMethod === 'CASH' 
                    ? "border-primary bg-primary text-primary-foreground ring-2 ring-primary/20" 
                    : "bg-transparent hover:bg-gray-50"
                )}
                onClick={() => handlePaymentMethodChange('CASH')}
              >
                <CircleDollarSign className="mr-2 h-4 w-4" />
                <span className="font-medium">Tiền mặt</span>
              </Button>
              <Button
                type="button"
                variant="outline"
                className={cn(
                  "h-auto w-full py-3 transition-all",
                  transaction.paymentMethod === 'TRANSFER' 
                    ? "border-primary bg-primary text-primary-foreground ring-2 ring-primary/20" 
                    : "bg-transparent hover:bg-gray-50"
                )}
                onClick={() => handlePaymentMethodChange('TRANSFER')}
              >
                <CreditCard className="mr-2 h-4 w-4" />
                <span className="font-medium">Chuyển khoản</span>
              </Button>
            </div>
          </div>
        </div>
        
        {/* Chương trình tích điểm với better visual design */}
        <div className="rounded-lg border-2 border-indigo-200 bg-indigo-50/70 p-4 shadow-sm">
          <div className="mb-2 flex items-center justify-between">
            <div className="flex items-center">
              <Gift className="mr-2 h-5 w-5 text-indigo-600" />
              <span className="font-medium text-indigo-700">Tích điểm thành viên</span>
            </div>
            <div className="rounded-full border border-indigo-200 bg-indigo-100 px-2.5 py-1 text-xs font-medium text-indigo-700 shadow-sm">
              +{Math.floor(transaction.subtotal / 10000)} điểm
            </div>
          </div>
          <p className="text-sm text-indigo-600">
            Khách hàng sẽ nhận được điểm thưởng khi hoàn tất thanh toán
          </p>
          <div className="mt-2 flex items-center text-xs text-indigo-500">
            <TrendingUp className="mr-1 h-3 w-3" />
            Tích lũy điểm để đổi quà tặng hấp dẫn
          </div>
        </div>
      </CardContent>
      
      <CardFooter className="border-t bg-gray-50/80 px-4 py-4">
        <Button
          onClick={handlePayment}
          disabled={transaction.items.length === 0 || isProcessingPayment}
          className={cn(
            "w-full py-5 text-base font-medium shadow-md transition-all",
            transaction.items.length > 0 && !isProcessingPayment && "hover:scale-[1.02] hover:shadow-lg"
          )}
        >
          {isProcessingPayment ? (
            <>
              <Loader2 className="mr-2 h-5 w-5 animate-spin" />
              Đang xử lý...
            </>
          ) : (
            <>
              <CreditCard className="mr-2 h-5 w-5" />
              Thanh toán
            </>
          )}
        </Button>
      </CardFooter>
    </Card>
  );
}; 