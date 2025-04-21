
// Customer type definition
export interface Customer {
  id: number;
  name: string;
  phone: string;
  email?: string;
  address?: string;
}

// Transaction item representing a product in a transaction
export interface TransactionItem {
  id: string;
  productId: number;
  name: string;
  quantity: number;
  price: number;
  total: number;
  imageUrl?: string;
}

// Payment method options
export type PaymentMethod = 'cash' | 'transfer';

// Transaction/Order entity
export interface Transaction {
  id: string;
  title: string;
  items: TransactionItem[];
  customer: Customer | null;
  subtotal: number;
  discount: number;
  total: number;
  paymentMethod: PaymentMethod;
  paymentAmount: number;
  status: 'draft' | 'completed' | 'cancelled';
  createdAt: Date | string;
}


export interface CustomersSearchResponse {
  data: Customer[];
  total: number;
  page: number;
  limit: number;
}

// API request types
export interface SearchProductsParams {
  keyword: string;
  page: number;
  limit: number;
}

export interface SearchCustomersParams {
  keyword?: string;
  page?: number;
  limit?: number;
} 