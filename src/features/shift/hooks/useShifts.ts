import { useInfiniteQuery } from "@tanstack/react-query"
import { getShifts } from "../api/getShifts"
import { ShiftListItem } from "../types"

export const useShifts = () => {
  const {
    data,
    isLoading,
    isError,
    error,
    fetchNextPage,
    hasNextPage,
    isFetchingNextPage,
  } = useInfiniteQuery({
    queryKey: ["shifts"],
    queryFn: ({ pageParam = 1 }) => getShifts({ page: pageParam }),
    initialPageParam: 1,
    getNextPageParam: (lastPage) => {
      const { meta } = lastPage
      if (meta.page < meta.pages) {
        return meta.page + 1
      }
      return undefined
    },
  })

  const shifts: ShiftListItem[] = data?.pages.flatMap((page) => page.result) || []
  const totalItems = data?.pages[0]?.meta.total || 0

  return {
    shifts,
    totalItems,
    isLoading,
    isError,
    error,
    fetchNextPage,
    hasNextPage,
    isFetchingNextPage,
  }
} 