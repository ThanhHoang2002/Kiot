import { zodResolver } from '@hookform/resolvers/zod';
import { useForm } from 'react-hook-form';
import * as z from 'zod';

import { Button } from '@/components/ui/button';
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { Checkbox } from '@/components/ui/checkbox';
import { Customer } from '../types/customer';

// Schema validation cho form
const formSchema = z.object({
  fullname: z
    .string()
    .min(2, { message: 'Tên khách hàng phải có ít nhất 2 ký tự' })
    .max(100, { message: 'Tên khách hàng không vượt quá 100 ký tự' }),
  phone: z
    .string()
    .min(10, { message: 'Số điện thoại phải có ít nhất 10 số' })
    .max(15, { message: 'Số điện thoại không vượt quá 15 số' })
    .regex(/^[0-9]+$/, { message: 'Số điện thoại chỉ được chứa số' }),
  active: z.boolean().default(true),
});

export type CustomerFormValues = z.infer<typeof formSchema>;

interface CustomerFormProps {
  initialData?: Partial<Customer>;
  onSubmit: (data: CustomerFormValues) => void;
  isLoading?: boolean;
}

export const CustomerForm = ({ initialData, onSubmit, isLoading }: CustomerFormProps) => {
  // Khởi tạo form với giá trị mặc định
  const form = useForm<CustomerFormValues>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      fullname: initialData?.fullname || '',
      phone: initialData?.phone || '',
      active: initialData?.active !== undefined ? initialData.active : true,
    },
  });

  const handleSubmit = (values: CustomerFormValues) => {
    onSubmit(values);
  };

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(handleSubmit)} className="space-y-6">
        <FormField
          control={form.control}
          name="fullname"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Họ tên</FormLabel>
              <FormControl>
                <Input 
                  placeholder="Nhập tên khách hàng" 
                  {...field} 
                  disabled={isLoading}
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="phone"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Số điện thoại</FormLabel>
              <FormControl>
                <Input 
                  placeholder="Nhập số điện thoại" 
                  {...field} 
                  disabled={isLoading}
                />
              </FormControl>
              <FormDescription>
                Số điện thoại sẽ được dùng để nhận dạng khách hàng
              </FormDescription>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="active"
          render={({ field }) => (
            <FormItem className="flex flex-row items-start space-x-3 space-y-0 rounded-md border p-4">
              <FormControl>
                <Checkbox
                  checked={field.value}
                  onCheckedChange={field.onChange}
                  disabled={isLoading}
                />
              </FormControl>
              <div className="space-y-1 leading-none">
                <FormLabel>Trạng thái hoạt động</FormLabel>
                <FormDescription>
                  Khách hàng có thể được sử dụng trong giao dịch
                </FormDescription>
              </div>
            </FormItem>
          )}
        />

        <Button type="submit" disabled={isLoading} className="w-full">
          {isLoading ? 'Đang xử lý...' : initialData?.id ? 'Cập nhật' : 'Thêm mới'}
        </Button>
      </form>
    </Form>
  );
}; 