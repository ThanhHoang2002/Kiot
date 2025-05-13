import { useQuery } from "@tanstack/react-query"
import { getShiftDetail } from "../api/getShiftDetail"

export const useShiftDetail = (shiftId: number | null) => {
  const {
    data: shiftDetail,
    isLoading,
    isError,
    error,
    refetch,
  } = useQuery({
    queryKey: ["shiftDetail", shiftId],
    queryFn: () => (shiftId ? getShiftDetail(shiftId) : Promise.reject("No shift ID provided")),
    enabled: !!shiftId,
  })

  return {
    shiftDetail,
    isLoading,
    isError,
    error,
    refetch,
  }
} 