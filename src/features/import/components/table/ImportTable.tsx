import React from "react";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { EyeIcon } from "lucide-react";
import { ImportHistory } from "../../types/import";
import { formatDate, formatPrice } from "@/utils/formatter";
import { useNavigate } from "react-router-dom";
import { paths } from "@/config/paths";

interface ImportTableProps {
  imports: ImportHistory[];
  isLoading: boolean;
  refetch: () => void;
}

const ImportTable = ({ imports, isLoading, refetch }: ImportTableProps) => {
  const navigate = useNavigate();

  const handleViewImport = (importId: number) => {
    const detailPath = paths.importDetail.replace(':id', importId.toString());
    navigate(detailPath);
  };

  if (isLoading) {
    return (
      <Card className="p-4">
        <div className="flex justify-center items-center h-40">
          <p>Đang tải dữ liệu...</p>
        </div>
      </Card>
    );
  }

  if (imports.length === 0) {
    return (
      <Card className="p-4">
        <div className="flex justify-center items-center h-40">
          <p>Không có lịch sử nhập hàng nào</p>
        </div>
      </Card>
    );
  }

  return (
    <Card>
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>ID</TableHead>
            <TableHead>Người tạo</TableHead>
            <TableHead>Nhà cung cấp</TableHead>
            <TableHead>Số lượng sản phẩm</TableHead>
            <TableHead>Tổng tiền</TableHead>
            <TableHead>Ngày tạo</TableHead>
            <TableHead className="text-right">Hành động</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {imports.map((importItem) => (
            <TableRow key={importItem.id}>
              <TableCell>{importItem.id}</TableCell>
              <TableCell>{importItem.user.fullname}</TableCell>
              <TableCell>{importItem.supplier.name}</TableCell>
              <TableCell>{importItem.importDetails.length}</TableCell>
              <TableCell>{formatPrice(importItem.totalPrice)}</TableCell>
              <TableCell>{formatDate(importItem.createdAt)}</TableCell>
              <TableCell className="text-right">
                <Button 
                  variant="ghost" 
                  size="icon"
                  onClick={() => handleViewImport(importItem.id)}
                  title="Xem chi tiết"
                >
                  <EyeIcon className="h-4 w-4" />
                </Button>
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </Card>
  );
};

export default ImportTable; 