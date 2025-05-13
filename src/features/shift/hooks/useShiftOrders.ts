import { useQuery } from "@tanstack/react-query"

import { getShiftOrders } from "../api/getShiftOrders"

export const useShiftOrders = (shiftId: number | null) => {
  const {
    data,
    isLoading,
    isError,
    error,
    refetch,
  } = useQuery({
    queryKey: ["shiftOrders", shiftId],
    queryFn: () => (shiftId ? getShiftOrders(shiftId) : Promise.reject("No shift ID provided")),
    enabled: !!shiftId,
    staleTime: 0,
    refetchOnMount: true,
    refetchOnWindowFocus: true,
  })

  return {
    orders: data?.result || [],
    totalOrders: data?.meta.total || 0,
    isLoading,
    isError,
    error,
    refetch,
  }
} 