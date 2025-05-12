import { ImageIcon, MoreVertical, Pencil, Trash2 } from "lucide-react";
import { useState, useCallback, memo, useMemo } from "react";

import { Category } from "../types";

import { Button } from "@/components/ui/button";
import { Card, CardContent, CardFooter, CardHeader } from "@/components/ui/card";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import Image from "@/components/ui/image";

interface CategoryCardProps {
  category: Category;
  onEdit: (category: Category) => void;
  onDelete: (id: number) => void;
}

export const CategoryCard = memo(({ category, onEdit, onDelete }: CategoryCardProps) => {
  const { id, name, image, description, createdAt } = category;
  const [dropdownOpen, setDropdownOpen] = useState(false);

  // Format ngày tạo - memoized
  const formattedDate = useMemo(() => (
    new Date(createdAt).toLocaleDateString("vi-VN", {
      day: "2-digit",
      month: "2-digit",
      year: "numeric",
    })
  ), [createdAt]);

  // Rút gọn mô tả nếu quá dài - memoized
  const truncatedDescription = useMemo(() => (
    description.length > 100 ? `${description.substring(0, 100)}...` : description
  ), [description]);

  // Callback để tránh tạo lại hàm mỗi lần render
  const handleEdit = useCallback(() => {
    // Đảm bảo đóng dropdown trước khi mở dialog
    setDropdownOpen(false);
    // Timeout ngắn để đảm bảo dropdown đã đóng hoàn toàn trước khi mở dialog
    setTimeout(() => {
      onEdit(category);
    }, 10);
  }, [category, onEdit]);

  const handleDelete = useCallback(() => {
    setDropdownOpen(false);
    onDelete(id);
  }, [id, onDelete]);

  return (
    <Card className="flex h-full flex-col overflow-hidden">
      <CardHeader className="p-0">
        <div className="relative h-48 w-full overflow-hidden bg-gray-100">
          <Image
            src={image}
            alt={name}
            containerClassName="h-full w-full"
            fallback={<ImageIcon className="h-12 w-12" />}
            className="h-full w-full object-cover transition-transform duration-300 hover:scale-105"
            loading="lazy"
          />
        </div>
      </CardHeader>
      <CardContent className="flex flex-1 flex-col p-4">
        <div className="mb-2 flex items-center justify-between">
          <h3 className="truncate text-lg font-semibold">{name}</h3>
          <DropdownMenu open={dropdownOpen} onOpenChange={setDropdownOpen}>
            <DropdownMenuTrigger asChild>
              <Button variant="ghost" size="icon" className="h-8 w-8">
                <MoreVertical className="h-4 w-4" />
                <span className="sr-only">Tùy chọn</span>
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end" sideOffset={5} className="z-50">
              <DropdownMenuItem onClick={handleEdit}>
                <Pencil className="mr-2 h-4 w-4" />
                Chỉnh sửa
              </DropdownMenuItem>
              <DropdownMenuItem 
                onClick={handleDelete}
                className="text-destructive"
              >
                <Trash2 className="mr-2 h-4 w-4" />
                Xóa
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
        <div className="flex-1">
          <p className="line-clamp-2 text-sm text-muted-foreground">{truncatedDescription}</p>
        </div>
      </CardContent>
      <CardFooter className="mt-auto h-12 border-t p-4 pt-3">
        <p className="text-xs text-muted-foreground">Ngày tạo: {formattedDate}</p>
      </CardFooter>
    </Card>
  );
});

CategoryCard.displayName = 'CategoryCard'; 