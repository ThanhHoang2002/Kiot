export interface CurrentShift {
  id: number
  user: User
  startTime: string
  endTime: string | null
  startCash: number
  endCash: number | null
  expectedCash: number | null
  cashDifference: number | null
  status: string
  note: string
  createdAt: string
  updatedAt: string
  cashRevenue: number | null
  transferRevenue: number | null
  totalRevenue: number | null
  orderCount: number | null
}

export type ShiftDetail = CurrentShift

export interface ShiftListItem {
  id: number
  user: User
  startTime: string
  endTime: string | null
  startCash: number
  endCash: number | null
  expectedCash: number | null
  cashDifference: number | null
  status: string
  note: string
  createdAt: string
  updatedAt: string
  cashRevenue: number | null
  transferRevenue: number | null
  totalRevenue: number | null
  orderCount: number | null
}

export interface User {
  id: number
  name: string
  username: string
}

export interface NoHaveShift {
  hasOpenShift: boolean
  message: string
}

export interface PaginationMeta {
  page: number
  pageSize: number
  pages: number
  total: number
}

export interface ShiftsResponse {
  meta: PaginationMeta
  result: ShiftListItem[]
}

export interface ShiftOrder {
  id: number
  totalPrice: number
  paymentMethod: string
  paymentStatus: string
  paymentUrl: string | null
  transactionNo: string | null
  paymentMessage: string | null
  createdAt: string
  updatedAt: string | null
  createdBy: string
  updatedBy: string | null
  user: OrderUser
  customer: OrderCustomer | null
}

export interface OrderUser {
  id: number
  name: string
  username: string
}

export interface OrderCustomer {
  id: number
  fullname: string
  phone: string
  point: number
  createdAt: string
  updatedAt: string | null
  createdBy: string
  updatedBy: string | null
  active: boolean
}

export interface ShiftOrdersResponse {
  meta: PaginationMeta
  result: ShiftOrder[]
}
