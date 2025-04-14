import { format } from "date-fns";
import { vi } from "date-fns/locale";
import { memo } from "react";


import { Product } from "../../types/product";

import Image from "@/components/ui/image";
import { TableCell, TableRow } from "@/components/ui/table";
import formatCurrency from "@/utils/formatCurrency";

interface ProductRowProps {
  product: Product;
  onClick: (productId: number) => void;
}

export const ProductRow = memo(({ product, onClick }: ProductRowProps) => (
  <TableRow className="cursor-pointer" onClick={() => onClick(product.id)}>
    <TableCell className="flex items-center gap-2 pl-5">
      <p>{product.id}</p>
    </TableCell>
    <TableCell>
      <Image
        src={product.image}
        alt={product.name}
        containerClassName="h-10 w-10 rounded"
      />
    </TableCell>
    <TableCell>{product.name}</TableCell>
    <TableCell className="text-right">
      {formatCurrency(product.sellPrice)}
    </TableCell>
    <TableCell className="text-right">
      {formatCurrency(product.buyPrice)}
    </TableCell>
    <TableCell className="text-center">{product.quantity}</TableCell>
    <TableCell>
      <span
        className={`inline-flex truncate rounded-full px-2 py-1 text-xs font-medium ${
          product.status === "Còn hàng"
            ? "bg-green-100 text-green-700"
            : "bg-red-100 text-red-700"
        }`}
      >
        {product.status === "Còn hàng" ? "Còn hàng" : "Hết hàng"}
      </span>
    </TableCell>
    <TableCell>
      {format(new Date(product.createdAt), "dd/MM/yyyy HH:mm", { locale: vi })}
    </TableCell>
    <TableCell>{product.category.name}</TableCell>
    <TableCell>{product.supplier.name}</TableCell>
  </TableRow>
));
ProductRow.displayName = "ProductRow";