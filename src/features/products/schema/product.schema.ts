import { z } from "zod"

export const productSchema = z.object({
    name: z.string().min(1, "Tên sản phẩm không được để trống"),
    sellPrice: z.number().min(0, "Giá bán phải lớn hơn 0"),
    costPrice: z.number().min(0, "Giá nhập phải lớn hơn 0"),
    quantity: z.number().min(0, "Số lượng phải lớn hơn hoặc bằng 0"),
    status: z.string().min(1, "Trạng thái không được để trống"),
    category: z.string().min(1, "Danh mục không được để trống"),
    description: z.string().optional(),
  })
  
export  type ProductFormValues = z.infer<typeof productSchema>