import { zodResolver } from "@hookform/resolvers/zod"
import { useForm } from "react-hook-form"
import { z } from "zod"

import { useShiftActions } from "../hooks/useShiftActions"

import { Button } from "@/components/ui/button"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"


// Schemas
const openShiftSchema = z.object({
  startCash: z.coerce.number().min(0, "Tiền đầu ca không được âm")
})

const closeShiftSchema = z.object({
  endCash: z.coerce.number().min(0, "Tiền cuối ca không được âm"),
  note: z.string().optional()
})

type OpenShiftFormValues = z.infer<typeof openShiftSchema>
type CloseShiftFormValues = z.infer<typeof closeShiftSchema>

interface ShiftDialogsProps {
  openDialog: boolean
  closeDialog: boolean
  onOpenDialogChange: (open: boolean) => void
  onCloseDialogChange: (open: boolean) => void
}

export function ShiftDialogs({
  openDialog,
  closeDialog,
  onOpenDialogChange,
  onCloseDialogChange
}: ShiftDialogsProps) {
  const { openShift, closeShift, isOpeningShift, isClosingShift } = useShiftActions()

  // Open shift form
  const openShiftForm = useForm<OpenShiftFormValues>({
    resolver: zodResolver(openShiftSchema),
    defaultValues: {
      startCash: 0
    }
  })

  // Close shift form
  const closeShiftForm = useForm<CloseShiftFormValues>({
    resolver: zodResolver(closeShiftSchema),
    defaultValues: {
      endCash: 0,
      note: ""
    }
  })

  // Handle open shift
  const handleOpenShift = (values: OpenShiftFormValues) => {
    openShift(values)
    onOpenDialogChange(false)
  }

  // Handle close shift
  const handleCloseShift = (values: CloseShiftFormValues) => {
    closeShift(values)
    onCloseDialogChange(false)
  }

  return (
    <>
      {/* Open Shift Dialog */}
      <Dialog open={openDialog} onOpenChange={onOpenDialogChange}>
        <DialogContent className="sm:max-w-[425px]">
          <DialogHeader>
            <DialogTitle>Mở ca làm việc</DialogTitle>
            <DialogDescription>
              Nhập số tiền đầu ca để bắt đầu ca làm việc
            </DialogDescription>
          </DialogHeader>
          <Form {...openShiftForm}>
            <form onSubmit={openShiftForm.handleSubmit(handleOpenShift)} className="space-y-6">
              <FormField
                control={openShiftForm.control}
                name="startCash"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Tiền đầu ca</FormLabel>
                    <FormControl>
                      <Input
                        type="number"
                        placeholder="Nhập số tiền đầu ca"
                        {...field}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <DialogFooter>
                <Button type="button" variant="outline" onClick={() => onOpenDialogChange(false)}>
                  Hủy
                </Button>
                <Button type="submit" disabled={isOpeningShift}>
                  {isOpeningShift ? "Đang xử lý..." : "Xác nhận"}
                </Button>
              </DialogFooter>
            </form>
          </Form>
        </DialogContent>
      </Dialog>

      {/* Close Shift Dialog */}
      <Dialog open={closeDialog} onOpenChange={onCloseDialogChange}>
        <DialogContent className="sm:max-w-[425px]">
          <DialogHeader>
            <DialogTitle>Đóng ca làm việc</DialogTitle>
            <DialogDescription>
              Nhập số tiền cuối ca và ghi chú (nếu có)
            </DialogDescription>
          </DialogHeader>
          <Form {...closeShiftForm}>
            <form onSubmit={closeShiftForm.handleSubmit(handleCloseShift)} className="space-y-4">
              <FormField
                control={closeShiftForm.control}
                name="endCash"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Tiền cuối ca</FormLabel>
                    <FormControl>
                      <Input
                        type="number"
                        placeholder="Nhập số tiền cuối ca"
                        {...field}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={closeShiftForm.control}
                name="note"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Ghi chú</FormLabel>
                    <FormControl>
                      <Textarea
                        placeholder="Nhập ghi chú nếu có"
                        {...field}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <DialogFooter>
                <Button type="button" variant="outline" onClick={() => onCloseDialogChange(false)}>
                  Hủy
                </Button>
                <Button type="submit" disabled={isClosingShift}>
                  {isClosingShift ? "Đang xử lý..." : "Xác nhận"}
                </Button>
              </DialogFooter>
            </form>
          </Form>
        </DialogContent>
      </Dialog>
    </>
  )
} 