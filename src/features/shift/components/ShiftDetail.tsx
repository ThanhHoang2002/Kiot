import { InfoIcon, ShoppingBagIcon } from "lucide-react"

import { ShiftDetail as ShiftDetailType } from "../types"
import { ShiftOrdersList } from "./ShiftOrdersList"

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Skeleton } from "@/components/ui/skeleton"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { formatDate } from "@/utils/date"
import { formatCurrency } from "@/utils/format"

interface ShiftDetailProps {
  shiftDetail: ShiftDetailType | undefined
  isLoading: boolean
}

export const ShiftDetail = ({ shiftDetail, isLoading }: ShiftDetailProps) => {
  if (isLoading) {
    return <ShiftDetailSkeleton />
  }

  if (!shiftDetail) {
    return (
      <div className="flex h-full items-center justify-center">
        <p className="text-muted-foreground">Chọn một ca làm việc để xem chi tiết</p>
      </div>
    )
  }

  const isActive = shiftDetail.status === "ACTIVE"

  return (
    <div className="flex flex-col gap-4 p-4">
      <div className="flex items-center justify-between">
        <h2 className="text-2xl font-semibold">Chi tiết ca làm việc</h2>
        <span
          className={`rounded-full px-3 py-1 text-sm ${
            isActive ? "bg-green-100 text-green-800" : "bg-blue-100 text-blue-800"
          }`}
        >
          {isActive ? "Đang hoạt động" : "Đã đóng"}
        </span>
      </div>

      <Tabs defaultValue="info" className="w-full">
        <TabsList className="mb-4 w-full md:w-auto">
          <TabsTrigger value="info" className="flex items-center gap-2">
            <InfoIcon size={16} />
            <span>Thông tin</span>
          </TabsTrigger>
          <TabsTrigger value="orders" className="flex items-center gap-2">
            <ShoppingBagIcon size={16} />
            <span>Đơn hàng</span>
          </TabsTrigger>
        </TabsList>

        <TabsContent value="info" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Thông tin nhân viên</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-1">
                <p className="font-medium">Tên: {shiftDetail.user.name}</p>
                <p className="text-sm text-muted-foreground">Username: {shiftDetail.user.username}</p>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Thời gian</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <p className="text-sm text-muted-foreground">Bắt đầu</p>
                  <p className="font-medium">{formatDate(shiftDetail.startTime)}</p>
                </div>
                <div>
                  <p className="text-sm text-muted-foreground">Kết thúc</p>
                  <p className="font-medium">
                    {shiftDetail.endTime ? formatDate(shiftDetail.endTime) : "Chưa kết thúc"}
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Thông tin tiền</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <p className="text-sm text-muted-foreground">Tiền ban đầu</p>
                  <p className="font-medium">{formatCurrency(shiftDetail.startCash)}</p>
                </div>
                <div>
                  <p className="text-sm text-muted-foreground">Tiền cuối ca</p>
                  <p className="font-medium">{formatCurrency(shiftDetail.endCash)}</p>
                </div>
                <div>
                  <p className="text-sm text-muted-foreground">Tiền dự kiến</p>
                  <p className="font-medium">{formatCurrency(shiftDetail.expectedCash)}</p>
                </div>
                <div>
                  <p className="text-sm text-muted-foreground">Chênh lệch</p>
                  <p 
                    className={`font-medium ${
                      (shiftDetail.cashDifference || 0) < 0 ? 'text-red-500' : 
                      (shiftDetail.cashDifference || 0) > 0 ? 'text-green-500' : ''
                    }`}
                  >
                    {formatCurrency(shiftDetail.cashDifference)}
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>

          {!isActive && (
            <Card>
              <CardHeader>
                <CardTitle>Doanh thu</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <p className="text-sm text-muted-foreground">Doanh thu tiền mặt</p>
                    <p className="font-medium">{formatCurrency(shiftDetail.cashRevenue)}</p>
                  </div>
                  <div>
                    <p className="text-sm text-muted-foreground">Doanh thu chuyển khoản</p>
                    <p className="font-medium">{formatCurrency(shiftDetail.transferRevenue)}</p>
                  </div>
                  <div>
                    <p className="text-sm text-muted-foreground">Tổng doanh thu</p>
                    <p className="font-medium">{formatCurrency(shiftDetail.totalRevenue)}</p>
                  </div>
                  <div>
                    <p className="text-sm text-muted-foreground">Số đơn hàng</p>
                    <p className="font-medium">{shiftDetail.orderCount || 0}</p>
                  </div>
                </div>
              </CardContent>
            </Card>
          )}

          {shiftDetail.note && (
            <Card>
              <CardHeader>
                <CardTitle>Ghi chú</CardTitle>
              </CardHeader>
              <CardContent>
                <p>{shiftDetail.note}</p>
              </CardContent>
            </Card>
          )}
        </TabsContent>

        <TabsContent value="orders">
          <ShiftOrdersList shiftId={shiftDetail.id} />
        </TabsContent>
      </Tabs>
    </div>
  )
}

const ShiftDetailSkeleton = () => {
  return (
    <div className="flex flex-col gap-4 p-4">
      <div className="flex items-center justify-between">
        <Skeleton className="h-8 w-48" />
        <Skeleton className="h-6 w-24 rounded-full" />
      </div>

      <Skeleton className="h-10 w-48" />

      {Array.from({ length: 4 }).map((_, index) => (
        <Card key={index}>
          <CardHeader>
            <Skeleton className="h-6 w-32" />
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-2 gap-4">
              {Array.from({ length: 4 }).map((_, i) => (
                <div key={i}>
                  <Skeleton className="mb-1 h-4 w-24" />
                  <Skeleton className="h-5 w-32" />
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      ))}
    </div>
  )
} 