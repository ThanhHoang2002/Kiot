
import { TransactionContent } from '@/features/transaction/components/TransactionContent';

const TransactionPage = () => {
  return (
    <div className="flex h-full min-h-[calc(100vh-60px)] flex-col space-y-4 px-6 py-2">      
        <TransactionContent />
    </div>
  );
};

export default TransactionPage;