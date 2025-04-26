import { PlusCircle, X } from 'lucide-react';
import { useCallback, useState } from 'react';

import { useTransactionStore } from '../store/transactionStore';

import { 
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from '@/components/ui/alert-dialog';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Tabs, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { cn } from '@/utils/cn';

export const TransactionTabs = () => {
  const [transactionToDelete, setTransactionToDelete] = useState<string | null>(null);
  
  const { 
    transactions, 
    activeTransactionId, 
    setActiveTransaction, 
    createTransaction,
    removeTransaction
  } = useTransactionStore();
  
  const handleAddTransaction = useCallback(() => {
    createTransaction();
  }, [createTransaction]);
  
  const handleTabChange = useCallback((value: string) => {
    setActiveTransaction(value);
  }, [setActiveTransaction]);
  
  const handleDeleteTransaction = useCallback((id: string, e: React.MouseEvent) => {
    e.stopPropagation();
    // Nếu chỉ còn 1 đơn, không cho xóa
    if (Object.keys(transactions).length <= 1) {
      return;
    }
    
    // Mở dialog xác nhận
    setTransactionToDelete(id);
  }, [transactions]);
  
  const confirmDelete = useCallback(() => {
    if (!transactionToDelete) return;
    
    // Xóa đơn hàng
    removeTransaction(transactionToDelete);
    
    // Đóng dialog
    setTransactionToDelete(null);
  }, [transactionToDelete, removeTransaction]);
  
  const cancelDelete = useCallback(() => {
    setTransactionToDelete(null);
  }, []);
  
  // Get sorted transaction IDs
  const transactionIds = Object.keys(transactions);
  
  // If no transactions exist, create one
  if (transactionIds.length === 0) {
    handleAddTransaction();
    return null; // Return early during first render
  }
  
  // If there are transactions but no active one, set the first as active
  if (transactionIds.length > 0 && !activeTransactionId) {
    setActiveTransaction(transactionIds[0]);
  }
  
  return (
    <>
      <div className="flex items-center space-x-2">
        <Tabs 
          value={activeTransactionId || undefined} 
          onValueChange={handleTabChange}
          className="flex-grow"
        >
          <TabsList className="flex w-full justify-start overflow-x-auto">
            {transactionIds.map((id) => {
              const transaction = transactions[id];
              const isActive = id === activeTransactionId;
              const hasItems = transaction.items.length > 0;
              
              return (
                <TabsTrigger 
                  key={id} 
                  value={id} 
                  className={cn(
                    "group relative flex-shrink-0",
                    isActive && "focus-visible:ring-0"
                  )}
                >
                  <span className="mr-1">{transaction.title}</span>
                  
                  {hasItems && (
                    <Badge 
                      variant="secondary" 
                      className="bg-primary/20 text-primary hover:bg-primary/30"
                    >
                      {transaction.items.length}
                    </Badge>
                  )}
                  
                  {/* Nút xóa đơn hàng */}
                  {transactionIds.length > 1 && (
                    <button
                      onClick={(e) => handleDeleteTransaction(id, e)}
                      className={cn(
                        "absolute -right-1 -top-1 h-4 w-4 rounded-full bg-gray-200 text-xs font-bold text-gray-600 opacity-0 transition-opacity hover:bg-red-200 hover:text-red-600",
                        isActive && "group-hover:opacity-100",
                        "focus:opacity-100 focus:outline-none"
                      )}
                      aria-label="Xóa đơn hàng"
                      title="Xóa đơn hàng"
                    >
                      <X className="h-3 w-3" />
                    </button>
                  )}
                </TabsTrigger>
              );
            })}
          </TabsList>
        </Tabs>
        
        <Button
          variant="outline"
          size="icon"
          onClick={handleAddTransaction}
          title="Thêm đơn hàng mới"
        >
          <PlusCircle className="h-5 w-5" />
        </Button>
      </div>
      
      {/* Dialog xác nhận xóa đơn hàng */}
      <AlertDialog open={!!transactionToDelete} onOpenChange={cancelDelete}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Xác nhận xóa đơn hàng</AlertDialogTitle>
            <AlertDialogDescription>
              Bạn có chắc chắn muốn xóa đơn hàng này không? Thao tác này không thể hoàn tác.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Hủy</AlertDialogCancel>
            <AlertDialogAction 
              onClick={confirmDelete}
              className="bg-red-600 hover:bg-red-700"
            >
              Xóa
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </>
  );
}; 