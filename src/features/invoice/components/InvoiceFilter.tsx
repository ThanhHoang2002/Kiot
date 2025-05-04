import { zodResolver } from '@hookform/resolvers/zod';
import { format, parse, isValid } from 'date-fns';
import { RotateCcw, Search } from 'lucide-react';
import { memo, useCallback } from 'react';
import { useForm } from 'react-hook-form';
import { z } from 'zod';

import { InvoiceFilterParams } from '../types/invoice';

import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Form, FormControl, FormField, FormItem, FormLabel } from '@/components/ui/form';
import { Input } from '@/components/ui/input';

const formSchema = z.object({
  phoneNumber: z.string().optional(),
  startDate: z.string().optional(),
  endDate: z.string().optional(),
});

type FormValues = z.infer<typeof formSchema>;

type Props = {
  onFilter: (values: Partial<InvoiceFilterParams>) => void;
  defaultValues?: InvoiceFilterParams;
};

const InvoiceFilter = ({ onFilter, defaultValues }: Props) => {
  const form = useForm<FormValues>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      phoneNumber: defaultValues?.search || '',
      startDate: defaultValues?.startDate ? defaultValues.startDate.split('T')[0] : '',
      endDate: defaultValues?.endDate ? defaultValues.endDate.split('T')[0] : '',
    },
  });

  const handleSubmit = useCallback((values: FormValues) => {
    const filters: Partial<InvoiceFilterParams> = {};
    
    if (values.phoneNumber) filters.search = values.phoneNumber;
    
    // Xử lý và định dạng ngày tháng cho API
    if (values.startDate) {
      const parsedDate = parse(values.startDate, 'yyyy-MM-dd', new Date());
      if (isValid(parsedDate)) {
        // Định dạng ISO string, bỏ timezone để backend xử lý
        filters.startDate = format(parsedDate, "yyyy-MM-dd'T'00:00:00");
      }
    }
    
    if (values.endDate) {
      const parsedDate = parse(values.endDate, 'yyyy-MM-dd', new Date());
      if (isValid(parsedDate)) {
        // Định dạng ISO string, thời gian cuối ngày
        filters.endDate = format(parsedDate, "yyyy-MM-dd'T'23:59:59");
      }
    }
    
    onFilter(filters);
  }, [onFilter]);

  const handleReset = useCallback(() => {
    form.reset({
      phoneNumber: '',
      startDate: '',
      endDate: '',
    });
    onFilter({
      search: undefined,
      startDate: undefined,
      endDate: undefined,
      page: 1
    });
  }, [form, onFilter]);

  return (
    <Card>
      <CardHeader className="pb-3">
        <CardTitle className="text-md flex items-center justify-between font-medium">
          <span>Bộ lọc</span>
          <Button 
            type="button" 
            variant="ghost" 
            size="icon"
            onClick={handleReset}
            className="h-8 w-8"
            title="Đặt lại bộ lọc"
          >
            <RotateCcw className="h-4 w-4" />
          </Button>
        </CardTitle>
      </CardHeader>
      <CardContent>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(handleSubmit)} className="space-y-4">
            <FormField
              control={form.control}
              name="phoneNumber"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Số điện thoại khách hàng</FormLabel>
                  <div className="relative">
                    <FormControl>
                      <Input 
                        placeholder="Nhập số điện thoại..." 
                        className="pl-8" 
                        {...field} 
                      />
                    </FormControl>
                    <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
                  </div>
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="startDate"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Từ ngày</FormLabel>
                  <FormControl>
                    <Input type="date" {...field} />
                  </FormControl>
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="endDate"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Đến ngày</FormLabel>
                  <FormControl>
                    <Input type="date" {...field} />
                  </FormControl>
                </FormItem>
              )}
            />

            <Button type="submit" className="w-full">
              Áp dụng
            </Button>
          </form>
        </Form>
      </CardContent>
    </Card>
  );
};

export default memo(InvoiceFilter); 