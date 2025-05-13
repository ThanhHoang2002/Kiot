import { useEffect } from "react"
import { useInView } from "react-intersection-observer"

import { ShiftListItem as ShiftType } from "../types"

import { Skeleton } from "@/components/ui/skeleton"
import { formatDate } from "@/utils/date"
import { formatCurrency } from "@/utils/format"

interface ShiftListProps {
  shifts: ShiftType[]
  isLoading: boolean
  hasNextPage: boolean | undefined
  isFetchingNextPage: boolean
  fetchNextPage: () => void
  selectedShiftId: number | null
  onSelectShift: (shiftId: number) => void
}

export const ShiftList = ({
  shifts,
  isLoading,
  hasNextPage,
  isFetchingNextPage,
  fetchNextPage,
  selectedShiftId,
  onSelectShift,
}: ShiftListProps) => {
  const { ref, inView } = useInView()

  useEffect(() => {
    if (inView && hasNextPage && !isFetchingNextPage) {
      fetchNextPage()
    }
  }, [inView, hasNextPage, isFetchingNextPage, fetchNextPage])

  if (isLoading) {
    return (
      <div className="flex flex-col space-y-4 p-4">
        {Array.from({ length: 5 }).map((_, index) => (
          <ShiftListItemSkeleton key={index} />
        ))}
      </div>
    )
  }

  if (shifts.length === 0) {
    return (
      <div className="flex h-full items-center justify-center p-4">
        <p className="text-muted-foreground">Không có ca làm việc nào</p>
      </div>
    )
  }

  return (
    <div className="flex flex-col space-y-2 p-4">
      <h2 className="mb-2 text-xl font-semibold">Danh sách ca làm việc</h2>
      <div className="flex flex-col space-y-2">
        {shifts.map((shift) => (
          <ShiftListItem
            key={shift.id}
            shift={shift}
            isSelected={shift.id === selectedShiftId}
            onSelect={() => onSelectShift(shift.id)}
          />
        ))}
      </div>
      {(hasNextPage || isFetchingNextPage) && (
        <div ref={ref} className="mt-2 flex justify-center p-2">
          {isFetchingNextPage && <ShiftListItemSkeleton />}
        </div>
      )}
    </div>
  )
}

interface ShiftListItemProps {
  shift: ShiftType
  isSelected: boolean
  onSelect: () => void
}

const ShiftListItem = ({ shift, isSelected, onSelect }: ShiftListItemProps) => {
  const isActive = shift.status === "OPEN"
  return (
    <div
      className={`flex cursor-pointer flex-col rounded-md border p-3 transition-colors hover:bg-accent ${
        isSelected ? "border-primary bg-accent" : ""
      }`}
      onClick={onSelect}
    >
      <div className="flex items-center justify-between">
        <div className="flex flex-col">
          <span className="font-medium">{shift.user.name}</span>
          <span className="text-sm text-muted-foreground">{shift.user.username}</span>
        </div>
        <div>
          <span
            className={`rounded-full px-2 py-1 text-xs ${
              isActive ? "bg-green-100 text-green-800" : "bg-blue-100 text-blue-800"
            }`}
          >
            {isActive ? "Đang hoạt động" : "Đã đóng"}
          </span>
        </div>
      </div>
      <div className="mt-2 flex justify-between text-sm">
        <div>
          <p>Bắt đầu: {formatDate(shift.startTime)}</p>
          {shift.endTime && <p>Kết thúc: {formatDate(shift.endTime)}</p>}
        </div>
        <div className="text-right">
          <p>Tiền ban đầu: {formatCurrency(shift.startCash)}</p>
          {shift.endCash && <p>Tiền cuối: {formatCurrency(shift.endCash)}</p>}
        </div>
      </div>
    </div>
  )
}

const ShiftListItemSkeleton = () => {
  return (
    <div className="flex flex-col space-y-2 rounded-md border p-3">
      <div className="flex items-center justify-between">
        <div className="flex flex-col gap-2">
          <Skeleton className="h-4 w-24" />
          <Skeleton className="h-3 w-16" />
        </div>
        <Skeleton className="h-6 w-20 rounded-full" />
      </div>
      <div className="mt-2 flex justify-between">
        <div className="flex flex-col gap-2">
          <Skeleton className="h-3 w-32" />
          <Skeleton className="h-3 w-32" />
        </div>
        <div className="flex flex-col gap-2">
          <Skeleton className="h-3 w-24" />
          <Skeleton className="h-3 w-24" />
        </div>
      </div>
    </div>
  )
} 