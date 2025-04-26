// Customer type definition
export interface Customer {
  id: number;
  name: string;
  phone: string;
  email?: string;
  address?: string;
}

// API response for customer searches that matches the provided format
export interface CustomerApiResponse {
  statusCode: number;
  error: string | null;
  message: string;
  data: {
    meta: {
      page: number;
      pageSize: number;
      pages: number;
      total: number;
    };
    result: CustomerApiData[];
  };
}

// Customer data as returned by the API
export interface CustomerApiData {
  id: number;
  fullname: string;
  phone: string;
  point: number;
  createdAt: string;
  updatedAt: string | null;
  createdBy: string;
  updatedBy: string | null;
  active: boolean;
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
export type PaymentMethod = 'CASH' | 'TRANSFER';

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

export interface Item {
  productId: number
  quantity: number
  sellPrice: number
}
export interface OrdersPayload {
  paymentMethod: 'CASH'| 'TRANSFER'
  customerId: number
  items: Item[]
}