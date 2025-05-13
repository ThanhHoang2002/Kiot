import { RefreshCw } from "lucide-react"
import { useState } from "react"

import { useShiftOrders } from "../hooks/useShiftOrders"
import { ShiftOrder } from "../types"

import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { ScrollArea } from "@/components/ui/scroll-area"
import { Skeleton } from "@/components/ui/skeleton"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { formatDate } from "@/utils/date"
import { formatCurrency } from "@/utils/format"

interface ShiftOrdersListProps {
  shiftId: number | null
}

export const ShiftOrdersList = ({ shiftId }: ShiftOrdersListProps) => {
  const { orders, totalOrders, isLoading, refetch } = useShiftOrders(shiftId)
  const [expandedOrderId, setExpandedOrderId] = useState<number | null>(null)
  const [isRefetching, setIsRefetching] = useState(false)

  const toggleOrderDetails = (orderId: number) => {
    setExpandedOrderId(expandedOrderId === orderId ? null : orderId)
  }

  const handleRefresh = async () => {
    setIsRefetching(true)
    try {
      await refetch()
    } finally {
      setIsRefetching(false)
    }
  }

  if (isLoading) {
    return <ShiftOrdersListSkeleton />
  }

  if (!shiftId) {
    return null
  }

  if (orders.length === 0) {
    return (
      <Card>
        <CardHeader className="flex flex-row items-center justify-between">
          <div>
            <CardTitle>Đơn hàng</CardTitle>
            <CardDescription>Không có đơn hàng nào trong ca làm việc này</CardDescription>
          </div>
          <Button
            variant="outline"
            size="sm"
            onClick={handleRefresh}
            disabled={isRefetching}
          >
            <RefreshCw className={`h-4 w-4 ${isRefetching ? 'animate-spin' : ''}`} />
            <span className="ml-2">Làm mới</span>
          </Button>
        </CardHeader>
      </Card>
    )
  }

  return (
    <Card>
      <CardHeader className="flex flex-row items-center justify-between">
        <div>
          <CardTitle>Đơn hàng</CardTitle>
          <CardDescription>Có {totalOrders} đơn hàng trong ca làm việc này</CardDescription>
        </div>
        <Button
          variant="outline"
          size="sm"
          onClick={handleRefresh}
          disabled={isRefetching}
        >
          <RefreshCw className={`h-4 w-4 ${isRefetching ? 'animate-spin' : ''}`} />
          <span className="ml-2">Làm mới</span>
        </Button>
      </CardHeader>
      <CardContent className="p-0">
        <ScrollArea className="h-[400px] md:h-[500px]">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead className="w-[80px]">Mã đơn</TableHead>
                <TableHead>Khách hàng</TableHead>
                <TableHead>Thanh toán</TableHead>
                <TableHead>Trạng thái</TableHead>
                <TableHead className="text-right">Tổng tiền</TableHead>
                <TableHead className="text-right">Thời gian</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {orders.map((order) => (
                <OrderRow 
                  key={order.id} 
                  order={order} 
                  isExpanded={expandedOrderId === order.id}
                  onToggleDetails={() => toggleOrderDetails(order.id)}
                />
              ))}
            </TableBody>
          </Table>
        </ScrollArea>
      </CardContent>
      <CardFooter className="flex justify-between pt-4">
        <div className="text-sm text-muted-foreground">Tổng cộng {totalOrders} đơn hàng</div>
      </CardFooter>
    </Card>
  )
}

interface OrderRowProps {
  order: ShiftOrder
  isExpanded: boolean
  onToggleDetails: () => void
}

const OrderRow = ({ order, isExpanded, onToggleDetails }: OrderRowProps) => {
  const getPaymentMethodLabel = (method: string) => {
    switch (method) {
      case "CASH":
        return "Tiền mặt"
      case "TRANSFER":
        return "Chuyển khoản"
      default:
        return method
    }
  }

  const getPaymentStatusLabel = (status: string) => {
    switch (status) {
      case "PAID":
        return { label: "Đã thanh toán", className: "bg-green-100 text-green-800" }
      case "PENDING":
        return { label: "Đang xử lý", className: "bg-yellow-100 text-yellow-800" }
      case "FAILED":
        return { label: "Thất bại", className: "bg-red-100 text-red-800" }
      default:
        return { label: status, className: "" }
    }
  }

  const statusInfo = getPaymentStatusLabel(order.paymentStatus)

  return (
    <>
      <TableRow 
        className="cursor-pointer hover:bg-accent/50" 
        onClick={onToggleDetails}
      >
        <TableCell className="font-medium">#{order.id}</TableCell>
        <TableCell>
          {order.customer ? order.customer.fullname : "Khách lẻ"}
        </TableCell>
        <TableCell>{getPaymentMethodLabel(order.paymentMethod)}</TableCell>
        <TableCell>
          <Badge className={statusInfo.className}>{statusInfo.label}</Badge>
        </TableCell>
        <TableCell className="text-right">{formatCurrency(order.totalPrice)}</TableCell>
        <TableCell className="text-right">{formatDate(order.createdAt)}</TableCell>
      </TableRow>
      {isExpanded && (
        <TableRow className="bg-accent/30">
          <TableCell colSpan={6} className="p-4">
            <div className="flex flex-col space-y-2">
              <div className="grid grid-cols-2 gap-4 md:grid-cols-3">
                <div>
                  <p className="text-sm font-medium">Người tạo</p>
                  <p className="text-sm">{order.user.name}</p>
                </div>
                {order.customer && (
                  <div>
                    <p className="text-sm font-medium">SĐT khách hàng</p>
                    <p className="text-sm">{order.customer.phone}</p>
                  </div>
                )}
                {order.transactionNo && (
                  <div>
                    <p className="text-sm font-medium">Mã giao dịch</p>
                    <p className="text-sm">{order.transactionNo}</p>
                  </div>
                )}
              </div>
            </div>
          </TableCell>
        </TableRow>
      )}
    </>
  )
}

const ShiftOrdersListSkeleton = () => {
  return (
    <Card>
      <CardHeader className="flex flex-row items-center justify-between">
        <div>
          <Skeleton className="h-6 w-32" />
          <Skeleton className="h-4 w-48" />
        </div>
        <Skeleton className="h-9 w-24" />
      </CardHeader>
      <CardContent>
        <div className="space-y-2">
          {Array.from({ length: 5 }).map((_, index) => (
            <div key={index} className="flex justify-between">
              <Skeleton className="h-5 w-1/4" />
              <Skeleton className="h-5 w-1/4" />
              <Skeleton className="h-5 w-1/4" />
            </div>
          ))}
        </div>
      </CardContent>
      <CardFooter>
        <Skeleton className="h-4 w-32" />
      </CardFooter>
    </Card>
  )
} 