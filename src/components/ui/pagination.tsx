import { ChevronLeft, ChevronRight, MoreHorizontal } from "lucide-react"
import { useMemo } from "react"

import { Button } from "@/components/ui/button"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"

interface PaginationProps {
  page: number
  total: number
  pageSize: number
  onPageChange: (page: number) => void
  onPageSizeChange?: (pageSize: number) => void
  siblingCount?: number
  showPageSizeOptions?: boolean
  pageSizeOptions?: number[]
}

export const Pagination = ({
  page,
  total,
  pageSize,
  onPageChange,
  onPageSizeChange,
  siblingCount = 1,
  showPageSizeOptions = true,
  pageSizeOptions = [10, 20, 30, 50],
}: PaginationProps) => {
  // Calculate total pages
  const totalPages = Math.ceil(total / pageSize)

  // Kiểm tra nếu không có dữ liệu
  if (totalPages <= 0) return null

  // Generate array of page numbers
  const getPageNumbers = () => {
    const totalPageNumbers = siblingCount * 2 + 3 // siblings + current + first + last
    
    // Trường hợp có ít hơn totalPageNumbers (hiển thị tất cả)
    if (totalPages <= totalPageNumbers) {
      return Array.from({ length: totalPages }, (_, i) => i + 1)
    }
    
    const leftSiblingIndex = Math.max(page - siblingCount, 1)
    const rightSiblingIndex = Math.min(page + siblingCount, totalPages)
    
    const shouldShowLeftDots = leftSiblingIndex > 2
    const shouldShowRightDots = rightSiblingIndex < totalPages - 1
    
    // Hiển thị dots ở cả hai phía
    if (shouldShowLeftDots && shouldShowRightDots) {
      return [
        1,
        'DOTS_LEFT',
        ...Array.from(
          { length: rightSiblingIndex - leftSiblingIndex + 1 },
          (_, i) => leftSiblingIndex + i
        ),
        'DOTS_RIGHT',
        totalPages,
      ]
    }
    
    // Hiển thị dots ở bên phải
    if (!shouldShowLeftDots && shouldShowRightDots) {
      return [
        ...Array.from({ length: leftSiblingIndex + siblingCount }, (_, i) => i + 1),
        'DOTS_RIGHT',
        totalPages,
      ]
    }
    
    // Hiển thị dots ở bên trái
    if (shouldShowLeftDots && !shouldShowRightDots) {
      return [
        1,
        'DOTS_LEFT',
        ...Array.from(
          { length: totalPages - rightSiblingIndex + siblingCount },
          (_, i) => totalPages - i
        ).reverse(),
      ]
    }
    
    return Array.from({ length: totalPages }, (_, i) => i + 1)
  }

  const pageNumbers = getPageNumbers()

  // Tạo pagination UI với useMemo để tối ưu hiệu suất
  const paginationUI = useMemo(() => {
    return (
      <div className="flex items-center gap-2">
        {/* Page size selector */}
        {showPageSizeOptions && onPageSizeChange && (
          <div className="mr-4 flex items-center gap-2">
            <span className="text-sm text-muted-foreground">Hiển thị:</span>
            <Select
              value={pageSize.toString()}
              onValueChange={(value) => onPageSizeChange(Number(value))}
            >
              <SelectTrigger className="h-8 w-[70px]">
                <SelectValue placeholder={pageSize} />
              </SelectTrigger>
              <SelectContent>
                {pageSizeOptions.map((size) => (
                  <SelectItem key={size} value={size.toString()}>
                    {size}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
        )}

        {/* Previous page button */}
        <Button
          variant="outline"
          size="icon"
          className="h-8 w-8"
          onClick={() => onPageChange(page - 1)}
          disabled={page === 1}
        >
          <ChevronLeft className="h-4 w-4" />
          <span className="sr-only">Trang trước</span>
        </Button>

        {/* Page buttons */}
        {pageNumbers.map((pageNumber, index) => {
          if (pageNumber === "DOTS_LEFT" || pageNumber === "DOTS_RIGHT") {
            return (
              <span key={`dots-${index}`} className="flex h-8 w-8 items-center justify-center">
                <MoreHorizontal className="h-4 w-4 text-muted-foreground" />
              </span>
            )
          }

          const pNum = pageNumber as number
          return (
            <Button
              key={pNum}
              variant={page === pNum ? "default" : "outline"}
              size="icon"
              className="h-8 w-8"
              onClick={() => onPageChange(pNum)}
            >
              {pNum}
            </Button>
          )
        })}

        {/* Next page button */}
        <Button
          variant="outline"
          size="icon"
          className="h-8 w-8"
          onClick={() => onPageChange(page + 1)}
          disabled={page === totalPages}
        >
          <ChevronRight className="h-4 w-4" />
          <span className="sr-only">Trang sau</span>
        </Button>
        
        {/* Total records display */}
        <div className="ml-4">
          <span className="text-sm text-muted-foreground">
            Tổng: {total} bản ghi
          </span>
        </div>
      </div>
    )
  }, [page, pageSize, total, totalPages, pageNumbers, onPageChange, onPageSizeChange, showPageSizeOptions, pageSizeOptions])

  return paginationUI
}
