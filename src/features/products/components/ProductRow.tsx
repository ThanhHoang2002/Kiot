import { format } from 'date-fns';
import { vi } from 'date-fns/locale';

import formatCurrency from '../../../utils/formatCurrency';
import { Product } from '../types/product';

import { Checkbox } from '@/components/ui/checkbox';
import Image from '@/components/ui/image';
import { TableCell, TableRow } from '@/components/ui/table';

interface ProductRowProps{
  product: Product;
  isSelected: boolean;
  onToggleSelect: (id: string) => void;
  onClick: (productId:string) => void;
}

export const ProductRow = ({
  product,
  isSelected,
  onToggleSelect,
  onClick
}:ProductRowProps) => (
  <TableRow className='cursor-pointer' onClick={ ()=>onClick(product.id)} >
    <TableCell>
      <Checkbox
        checked={isSelected}
        onCheckedChange={() => onToggleSelect(product.id)}
      />
    </TableCell>
    <TableCell className='flex items-center gap-2'>
    <Image
        src='https://pizzahut.vn/_next/image?url=https%3A%2F%2Fcdn.pizzahut.vn%2Fimages%2FWeb_V3%2FProducts_MenuTool%2FHA536%40%40Chicken_Gochujang_6pcs.webp&w=640&q=100'
        alt={product.name}
        containerClassName="h-10 w-10 rounded"
      />
      <p>{product.code}</p>
    </TableCell>
    <TableCell>{product.name}</TableCell>
    <TableCell className="text-right">
      {formatCurrency(product.sellPrice)}
    </TableCell>
    <TableCell className="text-right">
      {formatCurrency(product.costPrice)}
    </TableCell>
    <TableCell className="text-center">{product.quantity}</TableCell>
    <TableCell>
      <span className={`inline-flex rounded-full px-2 py-1 text-xs font-medium ${
        product.status === 'in_stock' 
          ? 'bg-green-100 text-green-700'
          : 'bg-red-100 text-red-700'
      }`}>
        {product.status === 'in_stock' ? 'Còn hàng' : 'Hết hàng'}
      </span>
    </TableCell>
    <TableCell>
      {format(new Date(product.createdAt), 'dd/MM/yyyy HH:mm', { locale: vi })}
    </TableCell>
    <TableCell>{product.category}</TableCell>
  </TableRow>
); 