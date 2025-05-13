import { useEffect } from "react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { ImportParams } from "../../api/importApi";
import { Supplier } from "../../types/import";
import { useForm, Controller } from "react-hook-form";
import { Card, CardContent, CardTitle } from "@/components/ui/card";
import { CalendarIcon } from "lucide-react";
import { format } from "date-fns";
import { vi } from "date-fns/locale";

import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { cn } from "@/utils/cn";

interface ImportFilterProps {
  suppliers: Supplier[];
  filters: ImportParams;
  updateFilters: (filters: Partial<ImportParams>) => void;
}

const ImportFilter = ({ suppliers, filters, updateFilters }: ImportFilterProps) => {
  const { register, handleSubmit, control, reset, setValue } = useForm<ImportParams>({
    defaultValues: {
      search: filters.search || "",
      supplierId: filters.supplierId,
      startDate: filters.startDate,
      endDate: filters.endDate,
    },
  });

  // Update form values when filters change
  useEffect(() => {
    setValue("search", filters.search || "");
    setValue("supplierId", filters.supplierId);
    setValue("startDate", filters.startDate);
    setValue("endDate", filters.endDate);
  }, [filters, setValue]);

  const handleFilter = (data: ImportParams) => {
    updateFilters({
      ...data,
      supplierId: data.supplierId ? Number(data.supplierId) : undefined,
    });
  };

  const handleReset = () => {
    reset({
      search: "",
      supplierId: undefined,
      startDate: undefined,
      endDate: undefined,
    });
    updateFilters({
      search: undefined,
      supplierId: undefined,
      startDate: undefined,
      endDate: undefined,
      page: 1,
    });
  };

  // Function to format date for display
  const formatDateString = (dateString?: string) => {
    if (!dateString) return "";
    const date = new Date(dateString);
    return format(date, "dd/MM/yyyy", { locale: vi });
  };

  return (
    <Card className="h-fit">
      <CardContent className="p-6">
        <CardTitle className="mb-4">Bộ lọc</CardTitle>
        <form onSubmit={handleSubmit(handleFilter)} className="space-y-4">
          <div className="space-y-4">
            <div className="space-y-2">
              <label className="text-sm font-medium">Tìm kiếm theo ID</label>
              <Input
                placeholder="Tìm kiếm theo ID"
                {...register("search")}
                className="w-full"
              />
            </div>
            <div className="space-y-2">
              <label className="text-sm font-medium">Nhà cung cấp</label>
              <Controller
                control={control}
                name="supplierId"
                render={({ field }) => (
                  <Select
                    onValueChange={field.onChange}
                    value={field.value?.toString()}
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="Chọn nhà cung cấp" />
                    </SelectTrigger>
                    <SelectContent>
                      {suppliers.map((supplier) => (
                        <SelectItem
                          key={supplier.id}
                          value={supplier.id.toString()}
                        >
                          {supplier.name}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                )}
              />
            </div>
            <div className="space-y-2">
              <label className="text-sm font-medium">Từ ngày</label>
              <Controller
                control={control}
                name="startDate"
                render={({ field }) => (
                  <Popover>
                    <PopoverTrigger asChild>
                      <Button
                        variant="outline"
                        className={cn(
                          "w-full justify-start text-left font-normal",
                          !field.value && "text-muted-foreground"
                        )}
                      >
                        <CalendarIcon className="mr-2 h-4 w-4" />
                        {field.value ? (
                          formatDateString(field.value)
                        ) : (
                          <span>Chọn ngày</span>
                        )}
                      </Button>
                    </PopoverTrigger>
                    <PopoverContent className="w-auto p-0">
                      <div className="p-3">
                        <Input
                          type="date"
                          value={field.value || ""}
                          onChange={(e) => field.onChange(e.target.value)}
                        />
                      </div>
                    </PopoverContent>
                  </Popover>
                )}
              />
            </div>
            <div className="space-y-2">
              <label className="text-sm font-medium">Đến ngày</label>
              <Controller
                control={control}
                name="endDate"
                render={({ field }) => (
                  <Popover>
                    <PopoverTrigger asChild>
                      <Button
                        variant="outline"
                        className={cn(
                          "w-full justify-start text-left font-normal",
                          !field.value && "text-muted-foreground"
                        )}
                      >
                        <CalendarIcon className="mr-2 h-4 w-4" />
                        {field.value ? (
                          formatDateString(field.value)
                        ) : (
                          <span>Chọn ngày</span>
                        )}
                      </Button>
                    </PopoverTrigger>
                    <PopoverContent className="w-auto p-0">
                      <div className="p-3">
                        <Input
                          type="date"
                          value={field.value || ""}
                          onChange={(e) => field.onChange(e.target.value)}
                        />
                      </div>
                    </PopoverContent>
                  </Popover>
                )}
              />
            </div>
          </div>
          <div className="flex flex-col gap-2">
            <Button type="submit" className="w-full">Lọc</Button>
            <Button 
              type="button" 
              variant="outline" 
              onClick={handleReset}
              className="w-full"
            >
              Đặt lại
            </Button>
          </div>
        </form>
      </CardContent>
    </Card>
  );
};

export default ImportFilter; 