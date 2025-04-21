import { PlusCircle } from 'lucide-react';
import { useCallback } from 'react';

import { useTransactionStore } from '../store/transactionStore';

import { Button } from '@/components/ui/button';
import { Tabs, TabsList, TabsTrigger } from '@/components/ui/tabs';

export const TransactionTabs = () => {
  const { 
    transactions, 
    activeTransactionId, 
    setActiveTransaction, 
    createTransaction 
  } = useTransactionStore();
  
  const handleAddTransaction = useCallback(() => {
    createTransaction();
  }, [createTransaction]);
  
  const handleTabChange = useCallback((value: string) => {
    setActiveTransaction(value);
  }, [setActiveTransaction]);
  
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
    <div className="flex items-center space-x-2">
      <Tabs 
        value={activeTransactionId || undefined} 
        onValueChange={handleTabChange}
        className="flex-grow"
      >
        <TabsList className="flex w-full justify-start overflow-x-auto">
          {transactionIds.map((id) => (
            <TabsTrigger key={id} value={id} className="flex-shrink-0">
              {transactions[id].title}
            </TabsTrigger>
          ))}
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
  );
}; 