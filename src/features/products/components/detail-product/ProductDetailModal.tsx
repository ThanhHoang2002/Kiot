import { zodResolver } from "@hookform/resolvers/zod";
import { Loader2, Save, Trash2, Upload } from "lucide-react";
import { useEffect, useRef, useState } from "react";
import { useForm } from "react-hook-form";

import { ProductDetailError } from "./ProductDetailError";
import { ProductDetailSkeleton } from "./ProductDetailSkeleton";
import { useCategories } from "../../hooks/useCategories";
import { useProduct } from "../../hooks/useProduct";
import { useSuppliers } from "../../hooks/useSuppliers";
import { ProductFormValues, productSchema } from "../../schema/product.schema";
import { Category } from "../../types/product";

import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import Image from "@/components/ui/image";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import { toast } from "@/hooks/use-toast";
import { useApiErrorHandler } from "@/hooks/useApiErrorHandler";

interface ProductDetailModalProps {
  productId?: number;
  isOpen: boolean;
  onClose: () => void;
  onSuccess?: () => void;
}

export function ProductDetailModal({
  productId,
  isOpen,
  onClose,
  onSuccess,
}: ProductDetailModalProps) {
  const isCreateMode = productId === undefined;
  
  // State để kiểm soát xem sản phẩm có bị xóa không
  const [isDeleted, setIsDeleted] = useState(false);
  
  // Chỉ sử dụng hook useProduct khi sản phẩm chưa bị xóa
  const { get, create, update, deletes } = useProduct(isDeleted ? 0 : (productId || 0));
  const { data, isLoading, isError } = get;
  
  // Lấy danh sách danh mục và nhà cung cấp từ hooks
  const { data: categories = [], isLoading: isCategoriesLoading } = useCategories();
  const { data: suppliers = [], isLoading: isSuppliersLoading } = useSuppliers();
  
  const [isSaving, setIsSaving] = useState(false);
  const [isDeleting, setIsDeleting] = useState(false);
  const [showUnsavedDialog, setShowUnsavedDialog] = useState(false);
  const [showDeleteDialog, setShowDeleteDialog] = useState(false);
  const [imagePreview, setImagePreview] = useState<string | null>(null);
  const [imageFile, setImageFile] = useState<File | null>(null);
  const { handleError } = useApiErrorHandler()
  const fileInputRef = useRef<HTMLInputElement>(null);

  const form = useForm<ProductFormValues>({
    resolver: zodResolver(productSchema),
    defaultValues: {
      name: "",
      sellPrice: 0,
      costPrice: 0,
      quantity: 0,
      status: "Còn hàng",
      category: "",
      supplier: "",
      description: "",
    },
  });

  // Load product data when editing an existing product
  useEffect(() => {
    if (!isOpen) return;

    if (data && !isCreateMode) {
      form.reset({
        name: data.name,
        sellPrice: data.sellPrice,
        costPrice: data.buyPrice, // Assuming buyPrice maps to costPrice
        quantity: data.quantity,
        status: data.status,
        category: data.category?.id?.toString() || "",
        supplier: data.supplier?.id?.toString() || "",
        description: data.description,
      });
      setImagePreview(data.image);
    } else if (isCreateMode) {
      // Reset form for create mode
      form.reset({
        name: "",
        sellPrice: 0,
        costPrice: 0,
        quantity: 0,
        status: "Còn hàng",
        category: "",
        supplier: "",
        description: "",
      });
      setImagePreview(null);
      setImageFile(null);
    }
  }, [data, isCreateMode, form, isOpen]);

  const handleClose = () => {
    if (form.formState.isDirty) {
      setShowUnsavedDialog(true);
    } else {
      onClose();
    }
  };

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      // Store the file for later upload
      setImageFile(file);

      // Create a preview URL
      const reader = new FileReader();
      reader.onloadend = () => {
        setImagePreview(reader.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  // Hàm để tìm danh mục dựa trên ID
  const findCategoryById = (categoryId: string): Category | undefined => {
    return categories.find(cat => cat.id.toString() === categoryId);
  };

  const handleSave = async (values: ProductFormValues) => {
    try {
      setIsSaving(true);

      // Xác định category từ ID được chọn
      const categoryObj = findCategoryById(values.category);

      if (!categoryObj) {
        toast({
          title: "Lỗi",
          description: "Danh mục không hợp lệ",
          variant: "destructive",
        });
        setIsSaving(false);
        return;
      }

      // Chuẩn bị FormData cho tạo mới hoặc cập nhật sản phẩm
      const formData = new FormData();
      formData.append("name", values.name);
      formData.append("sellPrice", values.sellPrice.toString());
      formData.append("buyPrice", values.costPrice.toString());
      formData.append("quantity", values.quantity.toString());
      formData.append("status", values.status);
      formData.append("description", values.description || "");
      formData.append("categoryId", values.category);
      
      if (values.supplier) {
        formData.append("supplierId", values.supplier);
      }

      // Add image file if it exists
      if (imageFile) {
        formData.append("image", imageFile);
      }

      if (isCreateMode) {
        // Create new product using create mutation
        await create.mutateAsync(formData, {
          onSuccess: () => {
            toast({
              title: "Thêm sản phẩm thành công",
              description: "Sản phẩm mới đã được thêm vào hệ thống",
            });
            
            // Call success callback if provided
            if (onSuccess) {
              onSuccess();
            }
            
            onClose();
          },
          onError: (error) => {
            handleError(error)
          }
        });
      } else if (productId) {
        // Update existing product using update mutation
        await update.mutateAsync(formData, {
          onSuccess: () => {
            toast({
              title: "Cập nhật sản phẩm thành công",
              description: "Thông tin sản phẩm đã được cập nhật",
            });
            
            // Call success callback if provided
            if (onSuccess) {
              onSuccess();
            }
            
            onClose();
          },
          onError: (error) => {
            handleError(error)
          }
        });
      }
    } catch (error) {
      handleError(error)
    } finally {
      setIsSaving(false);
    }
  };

  const handleDelete = () => {
    if (!productId) return;

    // Set deleting state
    setIsDeleting(true);

    // Delete the product using the mutation from useProduct hook
    deletes.mutate(productId, {
      onSuccess: () => {
        // Đánh dấu sản phẩm đã bị xóa để ngăn gọi API get
        setIsDeleted(true);
        
        // Show success toast
        toast({
          title: "Xóa sản phẩm thành công",
          description: "Sản phẩm đã được xóa khỏi hệ thống",
          className: "bg-green-500 text-white",
        });
        
        // Đóng dialog trước để tránh re-fetch dữ liệu của sản phẩm đã bị xóa
        setShowDeleteDialog(false);
        onClose();
        
        // Call success callback if provided
        if (onSuccess) {
          onSuccess();
        }

        // Reset state
        setIsDeleting(false);
      },
      onError: (error) => {
        // Show error toast
        toast({
          title: "Xóa sản phẩm thất bại",
          description: "Đã xảy ra lỗi khi xóa sản phẩm, vui lòng thử lại",
          variant: "destructive",
        });
        console.error("Failed to delete product:", error);
        // Reset state
        setIsDeleting(false);
        setShowDeleteDialog(false);
      },
    });
  };

  const handleClickChangeImage = () => {
    fileInputRef.current?.click();
  };

  const renderContent = () => {
    if (isLoading && !isCreateMode) {
      return <ProductDetailSkeleton />;
    }

    if (isError && !isCreateMode) {
      return <ProductDetailError />;
    }

    return (
      <Form {...form}>
        <form onSubmit={form.handleSubmit(handleSave)} className="space-y-6">
          <div className="grid gap-6">
            <div className="grid grid-cols-[300px_1fr] gap-8">
              {/* Product image section */}
              <div className="space-y-4">
                <div className="relative h-[300px] w-[300px] rounded-lg border">
                  {imagePreview ? (
                    <Image
                      src={imagePreview}
                      alt="Product preview"
                      containerClassName="h-full w-full rounded-lg"
                    />
                  ) : (
                    <div className="flex h-full w-full items-center justify-center rounded-lg bg-muted">
                      <Upload className="h-12 w-12 text-muted-foreground" />
                    </div>
                  )}
                  <Button
                    type="button"
                    variant="secondary"
                    className="absolute bottom-2 right-2"
                    size="sm"
                    onClick={handleClickChangeImage}
                  >
                    Thay đổi ảnh
                  </Button>
                  <input
                    type="file"
                    ref={fileInputRef}
                    className="hidden"
                    accept="image/*"
                    onChange={handleImageChange}
                  />
                </div>
              </div>

              {/* Main information section */}
              <div className="grid grid-cols-2 content-start gap-x-8 gap-y-4">
                <div className="">
                  <FormField
                    control={form.control}
                    name="name"
                    render={({ field }) => (
                      <FormItem className="space-y-2">
                        <FormLabel className="text-base">
                          Tên sản phẩm
                        </FormLabel>
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
                          onChange={(e) =>
                            field.onChange(Number(e.target.value))
                          }
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
                          onChange={(e) =>
                            field.onChange(Number(e.target.value))
                          }
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
                          onChange={(e) =>
                            field.onChange(Number(e.target.value))
                          }
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
                          <SelectItem value="Còn hàng">Đang bán</SelectItem>
                          <SelectItem value="Hết hàng">Hết hàng</SelectItem>
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
                      <Select
                        onValueChange={(value) => {
                          field.onChange(value);
                        }}
                        defaultValue={field.value}
                      >
                        <FormControl>
                          <SelectTrigger className="text-base">
                            <SelectValue placeholder="Chọn danh mục" />
                          </SelectTrigger>
                        </FormControl>
                        <SelectContent>
                          {isCategoriesLoading ? (
                            <SelectItem value="" disabled>Đang tải...</SelectItem>
                          ) : (
                            categories.map((category) => (
                              <SelectItem key={category.id} value={category.id.toString()}>
                                {category.name}
                              </SelectItem>
                            ))
                          )}
                        </SelectContent>
                      </Select>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="supplier"
                  render={({ field }) => (
                    <FormItem className="space-y-2">
                      <FormLabel className="text-base">Nhà cung cấp</FormLabel>
                      <Select
                        onValueChange={(value) => {
                          field.onChange(value);
                        }}
                        defaultValue={field.value}
                      >
                        <FormControl>
                          <SelectTrigger className="text-base">
                            <SelectValue placeholder="Chọn nhà cung cấp" />
                          </SelectTrigger>
                        </FormControl>
                        <SelectContent>
                          {isSuppliersLoading ? (
                            <SelectItem value="" disabled>Đang tải...</SelectItem>
                          ) : (
                            suppliers.map((supplier) => (
                              <SelectItem key={supplier.id} value={supplier.id.toString()}>
                                {supplier.name}
                              </SelectItem>
                            ))
                          )}
                        </SelectContent>
                      </Select>
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

            {!isCreateMode && (
              <Button
                type="button"
                variant="destructive"
                onClick={() => setShowDeleteDialog(true)}
                className="gap-2"
                disabled={isDeleting || deletes.isPending}
              >
                {isDeleting || deletes.isPending ? (
                  <Loader2 className="h-4 w-4 animate-spin" />
                ) : (
                  <Trash2 className="h-4 w-4" />
                )}
                Xóa sản phẩm
              </Button>
            )}

            <Button 
              type="submit" 
              disabled={isSaving || create.isPending || update.isPending} 
              className="gap-2"
            >
              {isSaving || create.isPending || update.isPending ? (
                <Loader2 className="h-4 w-4 animate-spin" />
              ) : (
                <Save className="h-4 w-4" />
              )}
              {isCreateMode ? "Thêm sản phẩm" : "Lưu thay đổi"}
            </Button>
          </DialogFooter>
        </form>
      </Form>
    );
  };

  return (
    <>
      <Dialog open={isOpen} onOpenChange={handleClose}>
        <DialogContent className="h-[90vh] overflow-y-auto sm:max-w-[1100px]">
          <DialogHeader>
            <DialogTitle className="text-xl">
              {isCreateMode
                ? "Thêm sản phẩm mới"
                : `Chi tiết sản phẩm ${data?.name}`}
            </DialogTitle>
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
                setShowUnsavedDialog(false);
                onClose();
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
              Bạn có chắc chắn muốn xóa sản phẩm này? Hành động này không thể
              hoàn tác.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel disabled={isDeleting}>Hủy</AlertDialogCancel>
            <AlertDialogAction
              onClick={handleDelete}
              disabled={isDeleting || deletes.isPending}
              className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
            >
              {isDeleting || deletes.isPending ? (
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
  );
}
