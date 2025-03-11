import { zodResolver } from "@hookform/resolvers/zod"
import { Loader2, Save, Trash2 } from "lucide-react"
import { useEffect, useState } from "react"
import { useForm } from "react-hook-form"
import { z } from "zod"

import { updateProduct } from "../api/productsApi"
import { useProduct } from "../hooks/useProduct"

import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog"
import { Button } from "@/components/ui/button"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form"
import Image from "@/components/ui/image"
import { Input } from "@/components/ui/input"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import { Skeleton } from "@/components/ui/skeleton"
import { Textarea } from "@/components/ui/textarea"

// Form validation schema
const productSchema = z.object({
  name: z.string().min(1, "Tên sản phẩm không được để trống"),
  sellPrice: z.number().min(0, "Giá bán phải lớn hơn 0"),
  costPrice: z.number().min(0, "Giá nhập phải lớn hơn 0"),
  quantity: z.number().min(0, "Số lượng phải lớn hơn hoặc bằng 0"),
  status: z.enum(["in_stock", "out_of_stock"]),
  category: z.string().min(1, "Danh mục không được để trống"),
  description: z.string().optional(),
})

type ProductFormValues = z.infer<typeof productSchema>

interface ProductDetailModalProps {
  productId: string
  isOpen: boolean
  onClose: () => void
}

// Loading skeleton component
const ProductDetailSkeleton = () => (
  <div className="grid gap-6 py-6">
    <div className="flex gap-8">
      <Skeleton className="h-[300px] w-[300px] rounded-lg" />
      <div className="flex-1 space-y-6">
        {Array.from({ length: 4 }).map((_, index) => (
          <div key={index} className="space-y-2">
            <Skeleton className="h-4 w-20" />
            <Skeleton className="h-10 w-full" />
          </div>
        ))}
      </div>
    </div>
  </div>
)

const ProductDetailError = () => (
  <div className="py-8 text-center">
    <div className="mb-2 text-lg text-gray-500">
      Không tìm thấy thông tin sản phẩm
    </div>
    <div className="text-sm text-gray-400">
      Vui lòng thử lại sau hoặc liên hệ quản trị viên
    </div>
  </div>
)

export function ProductDetailModal({
  productId,
  isOpen,
  onClose,
}: ProductDetailModalProps) {
  const { data, isLoading } = useProduct(productId)
  const [isSaving, setIsSaving] = useState(false)
  const [isDeleting, setIsDeleting] = useState(false)
  const [showUnsavedDialog, setShowUnsavedDialog] = useState(false)
  const [showDeleteDialog, setShowDeleteDialog] = useState(false)

  const form = useForm<ProductFormValues>({
    resolver: zodResolver(productSchema),
    defaultValues: {
      name: "",
      sellPrice: 0,
      costPrice: 0,
      quantity: 0,
      status: "in_stock",
      category: "",
      description: "",
    },
  })

  // Cập nhật form khi data thay đổi
  useEffect(() => {
    if (data) {
      form.reset(data)
    }
  }, [data, form])

  const handleClose = () => {
    if (form.formState.isDirty) {
      setShowUnsavedDialog(true)
    } else {
      onClose()
    }
  }

  const handleSave = async (values: ProductFormValues) => {
    try {
      setIsSaving(true)
      await updateProduct(productId, values)
      onClose()
    } catch (error) {
      console.error("Failed to save product:", error)
    } finally {
      setIsSaving(false)
    }
  }

  const handleDelete = async () => {
    try {
      setIsDeleting(true)
      // TODO: Implement delete API call
      await new Promise(resolve => setTimeout(resolve, 1000))
      onClose()
    } catch (error) {
      console.error("Failed to delete product:", error)
    } finally {
      setIsDeleting(false)
      setShowDeleteDialog(false)
    }
  }

  const renderContent = () => {
    if (isLoading) {
      return <ProductDetailSkeleton />
    }

    if (!data) {
      return <ProductDetailError />
    }

    return (
      <Form {...form}>
        <form onSubmit={form.handleSubmit(handleSave)} className="space-y-6">
          <div className="grid gap-6">
            <div className="grid grid-cols-[300px_1fr] gap-8">
              {/* Phần ảnh sản phẩm */}
              <div className="space-y-4">
                <div className="relative h-[300px] w-[300px] rounded-lg border">
                  <Image
                    src='https://pizzahut.vn/_next/image?url=https%3A%2F%2Fcdn.pizzahut.vn%2Fimages%2FWeb_V3%2FProducts_MenuTool%2FHA536%40%40Chicken_Gochujang_6pcs.webp&w=640&q=100'
                    alt={data.name}
                    containerClassName="h-full w-full rounded-lg"
                  />
                  <Button
                    variant="secondary"
                    className="absolute bottom-2 right-2"
                    size="sm"
                  >
                    Thay đổi ảnh
                  </Button>
                </div>
               
              </div>

              {/* Phần thông tin chính */}
              <div className="grid grid-cols-2 content-start gap-x-8 gap-y-4">
                <div className="">
                  <FormField
                    control={form.control}
                    name="name"
                    render={({ field }) => (
                      <FormItem className="space-y-2">
                        <FormLabel className="text-base">Tên sản phẩm</FormLabel>
                        <FormControl>
                          <Input {...field} className="text-base" />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </div>

                <FormField
                  control={form.control}
                  name="sellPrice"
                  render={({ field }) => (
                    <FormItem className="space-y-2">
                      <FormLabel className="text-base">Giá bán</FormLabel>
                      <FormControl>
                        <Input
                          type="number"
                          {...field}
                          onChange={(e) => field.onChange(Number(e.target.value))}
                          className="text-base"
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="costPrice"
                  render={({ field }) => (
                    <FormItem className="space-y-2">
                      <FormLabel className="text-base">Giá nhập</FormLabel>
                      <FormControl>
                        <Input
                          type="number"
                          {...field}
                          onChange={(e) => field.onChange(Number(e.target.value))}
                          className="text-base"
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="quantity"
                  render={({ field }) => (
                    <FormItem className="space-y-2">
                      <FormLabel className="text-base">Số lượng</FormLabel>
                      <FormControl>
                        <Input
                          type="number"
                          {...field}
                          onChange={(e) => field.onChange(Number(e.target.value))}
                          className="text-base"
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="status"
                  render={({ field }) => (
                    <FormItem className="space-y-2">
                      <FormLabel className="text-base">Trạng thái</FormLabel>
                      <Select
                        onValueChange={field.onChange}
                        defaultValue={field.value}
                      >
                        <FormControl>
                          <SelectTrigger className="text-base">
                            <SelectValue />
                          </SelectTrigger>
                        </FormControl>
                        <SelectContent>
                          <SelectItem value="in_stock">Đang bán</SelectItem>
                          <SelectItem value="out_of_stock">Ngừng bán</SelectItem>
                        </SelectContent>
                      </Select>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="category"
                  render={({ field }) => (
                    <FormItem className="space-y-2">
                      <FormLabel className="text-base">Danh mục</FormLabel>
                      <FormControl>
                        <Input {...field} className="text-base" />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <div className="col-span-2">
                  <FormField
                    control={form.control}
                    name="description"
                    render={({ field }) => (
                      <FormItem className="space-y-2">
                        <FormLabel className="text-base">Mô tả</FormLabel>
                        <FormControl>
                          <Textarea
                            {...field}
                            className="min-h-[120px] text-base"
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </div>
              </div>
            </div>
          </div>

          <DialogFooter className="flex items-center justify-between">
            <Button
                type="button"
                variant="outline"
                onClick={handleClose}
                className="gap-2"
              >
                Hủy
            </Button>
            <Button
                type="button"
                variant="destructive"
                onClick={() => setShowDeleteDialog(true)}
                className="gap-2"
                disabled={isDeleting}
              >
                {isDeleting ? (
                  <Loader2 className="h-4 w-4 animate-spin" />
                ) : (
                  <Trash2 className="h-4 w-4" />
                )}
                Xóa sản phẩm
              </Button>
              <Button type="submit" disabled={isSaving} className="gap-2">
                {isSaving ? (
                  <Loader2 className="h-4 w-4 animate-spin" />
                ) : (
                  <Save className="h-4 w-4" />
                )}
                Lưu thay đổi
              </Button>
          </DialogFooter>
        </form>
      </Form>
    )
  }
  return (
    <>
      <Dialog open={isOpen} onOpenChange={handleClose}>
        <DialogContent className="h-[90vh] overflow-y-auto sm:max-w-[1100px]">
          <DialogHeader>
            <DialogTitle className="text-xl">Chi tiết sản phẩm {data?.name}</DialogTitle>
            <DialogDescription />
          </DialogHeader>
          {renderContent()}
        </DialogContent>
      </Dialog>
      <AlertDialog open={showUnsavedDialog} onOpenChange={setShowUnsavedDialog}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Bạn có thay đổi chưa lưu</AlertDialogTitle>
            <AlertDialogDescription>
              Bạn có muốn thoát mà không lưu các thay đổi?
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Tiếp tục chỉnh sửa</AlertDialogCancel>
            <AlertDialogAction
              onClick={() => {
                setShowUnsavedDialog(false)
                onClose()
              }}
            >
              Thoát
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>

      <AlertDialog open={showDeleteDialog} onOpenChange={setShowDeleteDialog}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Xác nhận xóa sản phẩm</AlertDialogTitle>
            <AlertDialogDescription>
              Bạn có chắc chắn muốn xóa sản phẩm này? Hành động này không thể hoàn tác.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel disabled={isDeleting}>Hủy</AlertDialogCancel>
            <AlertDialogAction
              onClick={handleDelete}
              disabled={isDeleting}
              className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
            >
              {isDeleting ? (
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
              ) : (
                <Trash2 className="mr-2 h-4 w-4" />
              )}
              Xóa sản phẩm
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </>
  )
} 