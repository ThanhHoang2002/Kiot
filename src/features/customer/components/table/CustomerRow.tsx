import { format, parseISO } from 'date-fns';
import { Eye } from 'lucide-react';
import { memo } from 'react';

import { Customer } from '../../types/customer';

import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { TableCell, TableRow } from '@/components/ui/table';

interface CustomerRowProps {
  customer: Customer;
  onView: (id: number) => void;
}

export const CustomerRow = memo(({ customer, onView }: CustomerRowProps) => {
  const formatDate = (dateString: string) => {
    try {
      return format(parseISO(dateString), 'dd/MM/yyyy HH:mm');
    } catch {
      return dateString;
    }
  };

  const handleView = (e: React.MouseEvent) => {
    e.stopPropagation();
    e.preventDefault();
    onView(customer.id);
  };

  return (
    <TableRow 
      key={customer.id}
      className="cursor-pointer hover:bg-gray-100"
      onClick={handleView}
    >
      <TableCell className="font-medium">{customer.id}</TableCell>
      <TableCell>{customer.fullname}</TableCell>
      <TableCell>
        <a href={`tel:${customer.phone}`} className="text-blue-600 hover:underline" onClick={(e) => e.stopPropagation()}>
          {customer.phone}
        </a>
      </TableCell>
      <TableCell>{customer.point}</TableCell>
      <TableCell>
        <Badge 
          variant={customer.active ? "default" : "destructive"}
        >
          {customer.active ? "Hoạt động" : "Vô hiệu hóa"}
        </Badge>
      </TableCell>
      <TableCell>{formatDate(customer.createdAt)}</TableCell>
      <TableCell>{customer.createdBy}</TableCell>
      <TableCell className="text-right">
        <Button 
          variant="ghost" 
          size="icon"
          onClick={handleView}
          title="Xem chi tiết"
        >
          <Eye className="h-4 w-4" />
        </Button>
      </TableCell>
    </TableRow>
  );
});

CustomerRow.displayName = 'CustomerRow'; 