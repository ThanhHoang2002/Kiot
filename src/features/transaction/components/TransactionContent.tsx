import { PaymentPanel } from './PaymentPanel';
import { ProductList } from './ProductList';
import { ProductSearch } from './ProductSearch';
import { TransactionTabs } from './TransactionTabs';

export const TransactionContent = () => {
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
            <ProductList />
          </div>
        </div>
        
        {/* Right column: Customer search and payment panel */}
        <div className="col-span-1 flex flex-col space-y-4">
          {/* Payment panel */}
          <div className="flex-grow">
            <PaymentPanel />
          </div>
        </div>
      </div>
    </div>
  );
}; 