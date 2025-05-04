export type PaymentMethod = 'CASH' | 'TRANSFER';
export type PaymentStatus = 'PENDING' | 'COMPLETED' | 'FAILED';

export interface User {
  id: number;
  name: string;
  username: string;
  gender: string;
  address: string;
  avatar: string;
  role: {
    id: number;
    name: string;
    description: string | null;
    createdAt: string;
    updatedAt: string | null;
    createdBy: string;
    updatedBy: string | null;
  };
  createdAt: string;
  updatedAt: string;
  createdBy: string;
  updatedBy: string;
}

export interface Customer {
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

export interface Invoice {
  id: number;
  totalPrice: number;
  paymentMethod: PaymentMethod;
  paymentStatus: PaymentStatus;
  paymentUrl: string | null;
  transactionNo: string | null;
  paymentMessage: string | null;
  createdAt: string;
  updatedAt: string | null;
  createdBy: string;
  updatedBy: string | null;
  user: User;
  customer: Customer | null;
}

export interface InvoicePagination {
  meta: {
    page: number;
    pageSize: number;
    pages: number;
    total: number;
  };
  result: Invoice[];
}

export interface InvoiceResponse {
  statusCode: number;
  error: string | null;
  message: string;
  data: InvoicePagination;
}

export type InvoiceFilterParams = {
  page?: number;
  pageSize?: number;
  paymentStatus?: PaymentStatus;
  paymentMethod?: PaymentMethod;
  startDate?: string;
  endDate?: string;
  search?: string;
} 