import { memo, useState } from "react";

import { ProductRow } from "./ProductRow";
import { ProductsPagination } from "./ProductsPagination";
import { ProductTableSkeleton } from "./ProductTableSkeleton";
import { ProductsParams } from "../../api/productsApi";
import { ProductsResponse } from "../../types/product";
import { ProductDetailModal } from "../detail-product/ProductDetailModal";

import {
  Table,
  TableBody,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { cn } from "@/utils/cn";

interface Column {
  key: string;
  label: string;
  align: string;
}

const COLUMNS: Column[] = [
  { key: "id", label: "Mã hàng", align: "text-left" },
  { key: "image", label: "Hình ảnh", align: "text-left" },
  { key: "name", label: "Tên hàng", align: "text-left" },
  { key: "sellPrice", label: "Giá bán", align: "text-right" },
  { key: "buyPrice", label: "Giá vốn", align: "text-right" },
  { key: "quantity", label: "Số lượng", align: "text-center" },
  { key: "status", label: "Trạng thái", align: "text-left" },
  { key: "createdAt", label: "Thời gian tạo", align: "text-left" },
  { key: "category", label: "Danh mục", align: "text-left" },
  { key: "supplier", label: "Nhà cung cấp", align: "text-left" },
] as const;

// Product status options

interface ProductsTableProps {
  data: ProductsResponse;
  isLoading: boolean;
  filters: ProductsParams;
  updateFilters: (filters: Partial<ProductsParams>) => void;
  handleDeleteSelected?: () => void;
}

export const ProductsTable = memo(
  ({ data, isLoading, filters, updateFilters }: ProductsTableProps) => {
    const [isOpen, setIsOpen] = useState(false);
    const [selectedProduct, setSelectedProduct] = useState<number>(0);

    const handleOpenModal = (productId: number) => {
      setSelectedProduct(productId);
      setIsOpen(true);
    };
    const handleCloseModal = () => {
      setIsOpen(false);
    };

    if (isLoading) {
      return <ProductTableSkeleton />;
    }

    if (!data) return null;
    const totalPages = data.meta.pages;
    return (
      <div className="flex flex-col gap-1">
        {/* Filters section */}

        <Table>
          <TableHeader className="bg-secondary">
            <TableRow>
              {COLUMNS.map((column) => (
                <TableHead
                  key={column.key}
                  className={cn(
                    column.align,
                    "truncate text-sm font-medium text-muted-foreground"
                  )}
                >
                  {column.label}
                </TableHead>
              ))}
            </TableRow>
          </TableHeader>
          <TableBody>
            {data.result.map((product) => (
              <ProductRow
                key={product.id}
                product={product}
                onClick={handleOpenModal}
              />
            ))}
          </TableBody>
        </Table>

        <ProductsPagination
          currentPage={filters.page as number}
          totalPages={totalPages}
          onPageChange={(page) => {
            updateFilters({ page: page });
          }}
          itemsPerPage={filters.size as number}
          totalItems={data.meta.total}
        />
        <ProductDetailModal
          isOpen={isOpen}
          onClose={handleCloseModal}
          productId={selectedProduct}
        />
      </div>
    );
  }
);
ProductsTable.displayName = "ProductsTable";
