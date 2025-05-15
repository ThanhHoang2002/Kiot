import { useQueryClient } from '@tanstack/react-query';
import { User, UserPlus } from 'lucide-react';
import { useState } from 'react';

import { CustomerPopover } from './CustomerPopover';
import { PaymentPanel } from './PaymentPanel';
import { ProductList } from './ProductList';
import { ProductSearch } from './ProductSearch';
import { QRPaymentDialog } from './QRPaymentDialog';
import { TransactionTabs } from './TransactionTabs';
import { useTransactionStore } from '../store/transactionStore';
import { Customer, OrdersPayload } from '../types';
import { announceSucessfulPayment, processingPayment } from '../utils/processingPayment';

import { toast } from '@/hooks/use-toast';
import { cn } from '@/utils/cn';

interface PaymentError {
  status?: number;
  message?: string;
  error?: unknown;
}

export const TransactionContent = () => {
  const [isCustomerDialogOpen, setIsCustomerDialogOpen] = useState(false);
  const [selectedCustomer, setSelectedCustomer] = useState<Customer | null>(null);
  const [isProcessingPayment, setIsProcessingPayment] = useState(false);
  const queryClient = useQueryClient();
  const {
    getActiveTransaction,
    setTransactionCustomer,
    removeProductFromTransaction,
    updateProductQuantity,
    removeTransaction
  } = useTransactionStore();

  const handlePayment = async () => {
    const transaction = getActiveTransaction();
    if (!transaction) {
      toast({
        title: "Lỗi",
        description: "Không có đơn hàng nào đang hoạt động",
        variant: "destructive"
      });
      return;
    }

    if (transaction.items.length === 0) {
      toast({
        title: "Lỗi",
        description: "Vui lòng thêm sản phẩm vào đơn hàng",
        variant: "destructive"
      });
      return;
    }

    try {
      setIsProcessingPayment(true);

      // Transform transaction data to match OrdersPayload
      const orderPayload: OrdersPayload = {
        customerId: transaction.customer?.id,
        paymentMethod: transaction.paymentMethod,
        items: transaction.items.map(item => ({
          productId: item.productId,
          quantity: item.quantity,
          sellPrice: item.price
        }))
      };

      const response = await processingPayment(orderPayload);
      // Clear current transaction after successful payment
      if (response) {
        removeTransaction(transaction.id);
        setSelectedCustomer(null)

        // Invalidate all relevant queries
        queryClient.invalidateQueries({ queryKey: ['products'] });
        queryClient.invalidateQueries({ queryKey: ['invoices'] });

        // Vô hiệu hóa TOÀN BỘ cache liên quan đến shiftOrders
        queryClient.removeQueries({ queryKey: ["shiftOrders"] });

        // Invalidate currentShift để cập nhật thông tin ca làm việc
        queryClient.invalidateQueries({ queryKey: ["currentShift"] });
        if (orderPayload.paymentMethod === 'TRANSFER') {
          const totalAmount = orderPayload.items.reduce((sum, item) => sum + (item.sellPrice * item.quantity), 0);
          await announceSucessfulPayment(totalAmount);
        }
        toast({
          title: "Thành công",
          description: "Đơn hàng đã được thanh toán"
        })
      } else {
        toast({
          title: "Thất bại",
          description: "Đơn hàng thanh toán thất bại"
        })
      }
    } catch (error: unknown) {
      // Show error message
      const paymentError = error as PaymentError;
      toast({
        title: "Lỗi thanh toán",
        description: paymentError.message || "Đã xảy ra lỗi khi xử lý thanh toán",
        variant: "destructive"
      });
      console.error("Payment error:", error);
    } finally {
      setIsProcessingPayment(false);
    }
  };

  const handleCustomerSelect = (customer: Customer) => {
    setSelectedCustomer(customer);
    setTransactionCustomer(customer);

    toast({
      description: `Đã chọn khách hàng: ${customer.name}`
    });
  };

  const transaction = getActiveTransaction();
  const displayCustomer = selectedCustomer || (transaction?.customer || null);

  const handleRemoveProduct = (itemId: string) => {
    // Extract productId from itemId if needed
    const item = transaction?.items.find(item => item.id === itemId);
    if (item) {
      removeProductFromTransaction(item.productId);
    }
  };

  const handleUpdateQuantity = (itemId: string, quantity: number) => {
    // Extract productId from itemId if needed
    const item = transaction?.items.find(item => item.id === itemId);
    if (item) {
      updateProductQuantity(item.productId, quantity);
    }
  };

  const CustomerSelectorWithPopover = () => {
    return (
      <CustomerPopover
        open={isCustomerDialogOpen}
        onOpenChange={setIsCustomerDialogOpen}
        onSelect={handleCustomerSelect}
      >
        <div
          className={cn(
            "flex cursor-pointer items-center rounded-md border p-3 transition-all",
            displayCustomer
              ? "border-blue-200 bg-blue-50 hover:border-blue-300"
              : "border-dashed border-gray-300 hover:border-gray-400 hover:bg-gray-50"
          )}
          onClick={() => setIsCustomerDialogOpen(true)}
        >
          {displayCustomer ? (
            <>
              <div className="mr-3 rounded-full bg-blue-100 p-1.5">
                <User className="h-4 w-4 text-blue-700" />
              </div>
              <div className="flex-1">
                <div className="font-medium">{displayCustomer.name}</div>
                <div className="text-xs text-gray-500">{displayCustomer.phone}</div>
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
      </CustomerPopover>
    );
  };

  return (
    <div className="flex h-full flex-1 flex-col space-y-4">
      {/* Transaction tabs and controls */}
      <TransactionTabs />

      <div className="grid flex-1 flex-grow grid-cols-3 gap-4">
        {/* Left column: Product search and list */}
        <div className="col-span-2 flex flex-col space-y-4">
          {/* Product search */}
          <div className="flex space-x-2">
            <ProductSearch />
          </div>

          {/* Product list */}
          <div className="flex-grow overflow-auto">
            <ProductList
              transaction={transaction}
              onRemoveItem={handleRemoveProduct}
              onUpdateQuantity={handleUpdateQuantity}
            />
          </div>
        </div>

        {/* Right column: Customer search and payment panel */}
        <div className="col-span-1 flex flex-col space-y-4">
          {/* Payment panel */}
          <div className="flex-grow">
            <PaymentPanel
              onPayment={handlePayment}
              customerSelector={<CustomerSelectorWithPopover />}
              isProcessingPayment={isProcessingPayment}
            />
          </div>
        </div>
      </div>

      {/* QR Payment Dialog */}
      <QRPaymentDialog />
    </div>
  );
}; 