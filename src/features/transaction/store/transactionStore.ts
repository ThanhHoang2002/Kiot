import { create } from 'zustand';

import { Customer, PaymentMethod, Transaction, TransactionItem } from '../types';

import { Product } from '@/features/products/types/product';

// Generate unique ID based on timestamp and random number
const generateId = (): string => {
  return `${Date.now()}_${Math.floor(Math.random() * 10000)}`;
};

interface TransactionState {
  // Transaction state
  transactions: Record<string, Transaction>;
  activeTransactionId: string | null;
  
  // Search and selection state
  searchKeyword: string;
  customerKeyword: string;
  
  // Actions
  setSearchKeyword: (keyword: string) => void;
  setCustomerKeyword: (keyword: string) => void;
  
  // Transaction management
  createTransaction: () => string;
  setActiveTransaction: (id: string | null) => void;
  getActiveTransaction: () => Transaction | null;
  updateTransaction: (id: string, updates: Partial<Transaction>) => void;
  removeTransaction: (id: string) => void;
  
  // Product management
  addProductToTransaction: (product: Product) => void;
  removeProductFromTransaction: (productId: number) => void;
  updateProductQuantity: (productId: number, quantity: number) => void;
  
  // Customer management
  setTransactionCustomer: (customer: Customer | null) => void;
  
  // Payment management
  setPaymentMethod: (method: PaymentMethod) => void;
  setPaymentAmount: (amount: number) => void;
  setDiscount: (amount: number) => void;
}

export const useTransactionStore = create<TransactionState>((set, get) => ({
  // Initial state
  transactions: {},
  activeTransactionId: null,
  searchKeyword: '',
  customerKeyword: '',
  
  // Search actions
  setSearchKeyword: (keyword) => set({ searchKeyword: keyword }),
  setCustomerKeyword: (keyword) => set({ customerKeyword: keyword }),
  
  // Transaction management
  createTransaction: () => {
    const id = generateId();
    const newTransaction: Transaction = {
      id,
      title: `Đơn hàng lúc ${new Date().toLocaleTimeString('vi-VN')}`,
      items: [],
      customer: null,
      subtotal: 0,
      discount: 0,
      total: 0,
      paymentMethod: 'CASH',
      paymentAmount: 0,
      status: 'draft',
      createdAt: new Date(),
    };
    
    set((state) => ({
      transactions: { ...state.transactions, [id]: newTransaction },
      activeTransactionId: id,
    }));
    
    return id;
  },
  
  setActiveTransaction: (id) => set({ activeTransactionId: id }),
  
  getActiveTransaction: () => {
    const { transactions, activeTransactionId } = get();
    if (!activeTransactionId) return null;
    return transactions[activeTransactionId] || null;
  },
  
  updateTransaction: (id, updates) => {
    set((state) => {
      if (!state.transactions[id]) return state;
      
      const updatedTransaction = {
        ...state.transactions[id],
        ...updates,
      };
      
      return {
        transactions: {
          ...state.transactions,
          [id]: updatedTransaction,
        },
      };
    });
  },
  
  removeTransaction: (id) => {
    set((state) => {
      const newTransactions = { ...state.transactions };
      delete newTransactions[id];
      
      // If removing active transaction, set the first available one as active
      let newActiveId = state.activeTransactionId;
      if (state.activeTransactionId === id) {
        const transactionIds = Object.keys(newTransactions);
        newActiveId = transactionIds.length > 0 ? transactionIds[0] : null;
      }
      
      return {
        transactions: newTransactions,
        activeTransactionId: newActiveId,
      };
    });
  },
  
  // Product management
  addProductToTransaction: (product) => {
    const { activeTransactionId, transactions } = get();
    if (!activeTransactionId || !transactions[activeTransactionId]) return;
    
    set((state) => {
      const transaction = state.transactions[activeTransactionId];
      
      // Check if product already exists
      const existingItemIndex = transaction.items.findIndex(
        (item) => item.productId === product.id
      );
      
      const updatedItems = [...transaction.items];
      
      if (existingItemIndex >= 0) {
        // Update existing item
        const existingItem = updatedItems[existingItemIndex];
        const newQuantity = existingItem.quantity + 1;
        
        updatedItems[existingItemIndex] = {
          ...existingItem,
          quantity: newQuantity,
          total: newQuantity * existingItem.price,
        };
      } else {
        // Add new item
        const newItem: TransactionItem = {
          id: generateId(),
          productId: product.id,
          name: product.name,
          quantity: 1,
          price: product.sellPrice,
          total: product.sellPrice,
          imageUrl: product.image,
        };
        
        updatedItems.push(newItem);
      }
      
      // Calculate new totals
      const subtotal = updatedItems.reduce((sum, item) => sum + item.total, 0);
      const total = Math.max(0, subtotal - transaction.discount);
      
      const updatedTransaction = {
        ...transaction,
        items: updatedItems,
        subtotal,
        total,
      };
      
      return {
        transactions: {
          ...state.transactions,
          [activeTransactionId]: updatedTransaction,
        },
      };
    });
  },
  
  removeProductFromTransaction: (productId) => {
    const { activeTransactionId, transactions } = get();
    if (!activeTransactionId || !transactions[activeTransactionId]) return;
    
    set((state) => {
      const transaction = state.transactions[activeTransactionId];
      
      // Remove the item
      const updatedItems = transaction.items.filter(
        (item) => item.productId !== productId
      );
      
      // Calculate new totals
      const subtotal = updatedItems.reduce((sum, item) => sum + item.total, 0);
      const total = Math.max(0, subtotal - transaction.discount);
      
      const updatedTransaction = {
        ...transaction,
        items: updatedItems,
        subtotal,
        total,
      };
      
      return {
        transactions: {
          ...state.transactions,
          [activeTransactionId]: updatedTransaction,
        },
      };
    });
  },
  
  updateProductQuantity: (productId, quantity) => {
    if (quantity <= 0) {
      get().removeProductFromTransaction(productId);
      return;
    }
    
    const { activeTransactionId, transactions } = get();
    if (!activeTransactionId || !transactions[activeTransactionId]) return;
    
    set((state) => {
      const transaction = state.transactions[activeTransactionId];
      
      // Update item quantity
      const updatedItems = transaction.items.map((item) => {
        if (item.productId === productId) {
          return {
            ...item,
            quantity,
            total: quantity * item.price,
          };
        }
        return item;
      });
      
      // Calculate new totals
      const subtotal = updatedItems.reduce((sum, item) => sum + item.total, 0);
      const total = Math.max(0, subtotal - transaction.discount);
      
      const updatedTransaction = {
        ...transaction,
        items: updatedItems,
        subtotal,
        total,
      };
      
      return {
        transactions: {
          ...state.transactions,
          [activeTransactionId]: updatedTransaction,
        },
      };
    });
  },
  
  // Customer management
  setTransactionCustomer: (customer) => {
    const { activeTransactionId } = get();
    if (!activeTransactionId) return;
    
    set((state) => {
      const transaction = state.transactions[activeTransactionId];
      if (!transaction) return state;
      
      const updatedTransaction = {
        ...transaction,
        customer,
      };
      
      return {
        transactions: {
          ...state.transactions,
          [activeTransactionId]: updatedTransaction,
        },
      };
    });
  },
  
  // Payment management
  setPaymentMethod: (method) => {
    const { activeTransactionId } = get();
    if (!activeTransactionId) return;
    
    set((state) => {
      const transaction = state.transactions[activeTransactionId];
      if (!transaction) return state;
      
      const updatedTransaction = {
        ...transaction,
        paymentMethod: method,
      };
      
      return {
        transactions: {
          ...state.transactions,
          [activeTransactionId]: updatedTransaction,
        },
      };
    });
  },
  
  setPaymentAmount: (amount) => {
    const { activeTransactionId } = get();
    if (!activeTransactionId) return;
    
    set((state) => {
      const transaction = state.transactions[activeTransactionId];
      if (!transaction) return state;
      
      const updatedTransaction = {
        ...transaction,
        paymentAmount: amount,
      };
      
      return {
        transactions: {
          ...state.transactions,
          [activeTransactionId]: updatedTransaction,
        },
      };
    });
  },
  
  setDiscount: (amount) => {
    const { activeTransactionId } = get();
    if (!activeTransactionId) return;
    
    set((state) => {
      const transaction = state.transactions[activeTransactionId];
      if (!transaction) return state;
      
      const updatedTransaction = {
        ...transaction,
        discount: amount,
        total: Math.max(0, transaction.subtotal - amount),
      };
      
      return {
        transactions: {
          ...state.transactions,
          [activeTransactionId]: updatedTransaction,
        },
      };
    });
  },
})); 