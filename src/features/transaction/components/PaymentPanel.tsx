import { CircleDollarSign, CreditCard, Loader2, Receipt, User, UserPlus, ShoppingBag, Gift, TrendingUp } from 'lucide-react';

import { useTransactionStore } from '../store/transactionStore';
import { PaymentMethod } from '../types';

import { Button } from '@/components/ui/button';
import { Card, CardContent, CardFooter, CardHeader } from '@/components/ui/card';
import { cn } from '@/utils/cn';

interface PaymentPanelProps {
  onOpenCustomerDialog?: () => void;
  onPayment?: () => void;
  isProcessingPayment?: boolean;
}

export const PaymentPanel = ({
  onOpenCustomerDialog,
  onPayment,
  isProcessingPayment = false,
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
      <Card className="h-full">
        <CardHeader className="text-center text-gray-500">
          <Receipt className="mx-auto h-8 w-8 text-gray-400" />
          <p>Không có đơn hàng đang hoạt động</p>
        </CardHeader>
      </Card>
    );
  }
  
  // Tính tổng số sản phẩm
  const totalItems = transaction.items.reduce((sum, item) => sum + item.quantity, 0);
  
  return (
    <Card className="flex h-full flex-col overflow-hidden">
      <CardHeader className="bg-gray-50/80 pb-4">
        <div className="text-sm font-medium text-gray-700">Thông tin thanh toán</div>
      </CardHeader>
      
      <CardContent className="flex-1 space-y-4 py-4">
        {/* Customer selection */}
        <div 
          className={cn(
            "flex cursor-pointer items-center rounded-md border p-3 transition-all",
            transaction.customer 
              ? "border-blue-200 bg-blue-50 hover:border-blue-300" 
              : "border-dashed border-gray-300 hover:border-gray-400 hover:bg-gray-50"
          )}
          onClick={onOpenCustomerDialog}
        >
          {transaction.customer ? (
            <>
              <div className="mr-3 rounded-full bg-blue-100 p-1.5">
                <User className="h-4 w-4 text-blue-700" />
              </div>
              <div className="flex-1">
                <div className="font-medium">{transaction.customer.name}</div>
                <div className="text-xs text-gray-500">{transaction.customer.phone}</div>
              </div>
            </>
          ) : (
            <>
              <div className="mr-3 rounded-full bg-gray-100 p-1.5">
                <UserPlus className="h-4 w-4 text-gray-600" />
              </div>
              <div className="flex-1">
                <div className="font-medium">Chọn khách hàng</div>
                <div className="text-xs text-gray-500">Thêm hoặc tìm khách hàng</div>
              </div>
            </>
          )}
        </div>
        
        
        {/* Payment details */}
        <div className="space-y-4">
          {/* Thông tin đơn hàng */}
          <div className="rounded-md border border-gray-200 p-3">
            <div className="mb-3 text-sm font-medium text-gray-700">Thông tin đơn hàng</div>
            
            <div className="space-y-2">
              <div className="flex items-center justify-between">
                <div className="flex items-center text-gray-600">
                  <ShoppingBag className="mr-2 h-4 w-4" />
                  <span>Tổng số sản phẩm:</span>
                </div>
                <span className="font-medium">{totalItems} sản phẩm</span>
              </div>
              
              <div className="flex items-center justify-between text-base font-semibold">
                <span>Tổng tiền hàng:</span>
                <span className="text-emerald-600">
                  {new Intl.NumberFormat('vi-VN', { style: 'currency', currency: 'VND' }).format(transaction.subtotal)}
                </span>
              </div>
            </div>
          </div>
          
          {/* Phương thức thanh toán */}
          <div className="rounded-md border border-gray-200 p-3">
            <div className="mb-3 text-sm font-medium text-gray-700">Phương thức thanh toán:</div>
            <div className="flex space-x-2">
              <Button
                type="button"
                variant={transaction.paymentMethod === 'cash' ? 'default' : 'outline'}
                className={cn(
                  "h-auto flex-1 py-2",
                  transaction.paymentMethod === 'cash' 
                    ? "bg-primary text-primary-foreground" 
                    : "bg-transparent hover:bg-gray-50"
                )}
                onClick={() => handlePaymentMethodChange('cash')}
              >
                <CircleDollarSign className="mr-2 h-4 w-4" />
                Tiền mặt
              </Button>
              <Button
                type="button"
                variant={transaction.paymentMethod === 'transfer' ? 'default' : 'outline'}
                className={cn(
                  "h-auto flex-1 py-2",
                  transaction.paymentMethod === 'transfer' 
                    ? "bg-primary text-primary-foreground" 
                    : "bg-transparent hover:bg-gray-50"
                )}
                onClick={() => handlePaymentMethodChange('transfer')}
              >
                <CreditCard className="mr-2 h-4 w-4" />
                Chuyển khoản
              </Button>
            </div>
          </div>
        </div>
        
        {/* Chương trình tích điểm */}
        <div className="rounded-md border border-indigo-200 bg-indigo-50 p-3">
          <div className="flex items-center justify-between">
            <div className="flex items-center">
              <Gift className="mr-2 h-4 w-4 text-indigo-600" />
              <span className="font-medium text-indigo-700">Tích điểm thành viên</span>
            </div>
            <div className="rounded-full bg-indigo-200 px-2 py-0.5 text-xs font-medium text-indigo-700">
              +{Math.floor(transaction.subtotal / 10000)} điểm
            </div>
          </div>
          <p className="mt-1 text-sm text-indigo-600">
            Khách hàng sẽ nhận được điểm thưởng khi hoàn tất thanh toán
          </p>
          <div className="mt-2 flex items-center text-xs text-indigo-500">
            <TrendingUp className="mr-1 h-3 w-3" />
            Tích lũy điểm để đổi quà tặng hấp dẫn
          </div>
        </div>
      </CardContent>
      
      <CardFooter className="bg-gray-50/80 px-4 py-3">
        <Button
          onClick={handlePayment}
          disabled={transaction.items.length === 0 || isProcessingPayment}
          className="w-full py-5 text-base font-medium shadow-lg"
        >
          {isProcessingPayment ? (
            <>
              <Loader2 className="mr-2 h-4 w-4 animate-spin" />
              Đang xử lý...
            </>
          ) : (
            'Thanh toán'
          )}
        </Button>
      </CardFooter>
    </Card>
  );
}; 