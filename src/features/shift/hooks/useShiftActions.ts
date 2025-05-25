import { useMutation, useQueryClient } from "@tanstack/react-query"
import { AxiosError } from "axios"

import { closeShift, CloseShiftData } from "../api/closeShift"
import { openShift, OpenShiftData } from "../api/openShift"

import { toast } from "@/hooks/use-toast"

export const useShiftActions = () => {
  const queryClient = useQueryClient()

  const openShiftMutation = useMutation({
    mutationFn: openShift,
    onSuccess: () => {
      toast({
        title: "Mở ca thành công",
        variant: "default",
      })
      queryClient.invalidateQueries({ queryKey: ["currentShift"] })
      queryClient.invalidateQueries({ queryKey: ["shifts"] })
    },
    onError: (error) => {
      toast({
        title: "Mở ca thất bại",
        description: (error as Error).message,
        variant: "destructive",
      })
    }
  })

  const closeShiftMutation = useMutation({
    mutationFn: closeShift,
    onSuccess: () => {
      toast({
        title: "Đóng ca thành công",
        description: "Ca làm việc đã được đóng thành công",
        variant: "default",
      })
      queryClient.invalidateQueries({ queryKey: ["currentShift"] })
      queryClient.invalidateQueries({ queryKey: ["shifts"] })
    },
    onError: (error ) => {
      let errorMessage = "Đã xảy ra lỗi khi đóng ca"
      
      if (error instanceof AxiosError && error.response?.data?.message) {
        errorMessage = error.response.data.message
      } else if (error instanceof Error) {
        errorMessage = error.message
      }
      
      toast({
        title: "Đóng ca thất bại",
        description: errorMessage,
        variant: "destructive",
      })
    }
  })

  return {
    openShift: (data: OpenShiftData) => openShiftMutation.mutate(data),
    closeShift: (data: CloseShiftData) => closeShiftMutation.mutate(data),
    isOpeningShift: openShiftMutation.isPending,
    isClosingShift: closeShiftMutation.isPending
  }
} 