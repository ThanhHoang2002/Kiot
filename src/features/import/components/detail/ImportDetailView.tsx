import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { ImportHistory } from "../../types/import";
import { formatDate, formatPrice } from "@/utils/formatter";
import {
  BadgeInfo,
  Calendar,
  Package,
  User,
  Building,
  FileText,
  ShoppingBag,
} from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";

interface ImportDetailViewProps {
  importHistory: ImportHistory;
  isLoading: boolean;
}

const ImportDetailView = ({ importHistory, isLoading }: ImportDetailViewProps) => {
  if (isLoading) {
    return (
      <Card>
        <CardHeader>
          <CardTitle>Chi tiết nhập hàng</CardTitle>
          <CardDescription>Đang tải dữ liệu...</CardDescription>
        </CardHeader>
      </Card>
    );
  }

  if (!importHistory) {
    return (
      <Card>
        <CardHeader>
          <CardTitle>Chi tiết nhập hàng</CardTitle>
          <CardDescription>Không tìm thấy dữ liệu</CardDescription>
        </CardHeader>
      </Card>
    );
  }

  return (
    <div className="space-y-6">
      {/* Summary Card */}
      <Card className="overflow-hidden border-0 shadow-md">
        <div className="bg-primary/10 px-6 py-4 border-b border-border/30">
          <div className="flex flex-col md:flex-row md:justify-between md:items-center gap-4">
            <div>
              <h2 className="text-2xl font-bold flex items-center gap-2">
                <BadgeInfo className="h-5 w-5 text-primary" />
                Phiếu nhập hàng #{importHistory.id}
              </h2>
              <div className="text-sm text-muted-foreground flex items-center mt-1">
                <Calendar className="h-4 w-4 mr-1" />
                {formatDate(importHistory.createdAt)}
              </div>
            </div>
            <Badge className="w-fit px-3 py-1 text-base bg-primary/20 text-primary hover:bg-primary/30 hover:text-primary">
              Đã nhập
            </Badge>
          </div>
        </div>

        <CardContent className="p-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            {/* Left column - Import Info */}
            <div className="space-y-6">
              <div>
                <h3 className="text-base font-semibold flex items-center gap-2 mb-3">
                  <User className="h-4 w-4" />
                  Thông tin người tạo
                </h3>
                <div className="bg-muted/50 rounded-lg p-4">
                  <div className="grid grid-cols-2 gap-3">
                    <div>
                      <p className="text-sm text-muted-foreground">Người tạo:</p>
                      <p className="font-medium">{importHistory.user.fullname}</p>
                    </div>
                    <div>
                      <p className="text-sm text-muted-foreground">Tài khoản:</p>
                      <p className="font-medium">{importHistory.user.username}</p>
                    </div>
                  </div>
                </div>
              </div>

              <div>
                <h3 className="text-base font-semibold flex items-center gap-2 mb-3">
                  <Package className="h-4 w-4" />
                  Thông tin nhập hàng
                </h3>
                <div className="bg-muted/50 rounded-lg p-4">
                  <div className="space-y-3">
                    <div className="grid grid-cols-2 gap-3">
                      <div>
                        <p className="text-sm text-muted-foreground">Số lượng sản phẩm:</p>
                        <p className="font-medium">{importHistory.importDetails.length} sản phẩm</p>
                      </div>
                      <div>
                        <p className="text-sm text-muted-foreground">Tổng số lượng:</p>
                        <p className="font-medium">
                          {importHistory.importDetails.reduce((total, detail) => total + detail.quantity, 0)} đơn vị
                        </p>
                      </div>
                    </div>
                    <div>
                      <p className="text-sm text-muted-foreground">Tổng tiền:</p>
                      <p className="text-lg font-semibold text-primary">
                        {formatPrice(importHistory.totalPrice)}
                      </p>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Right column - Supplier Info */}
            <div>
              <h3 className="text-base font-semibold flex items-center gap-2 mb-3">
                <Building className="h-4 w-4" />
                Thông tin nhà cung cấp
              </h3>
              <div className="bg-muted/50 rounded-lg p-4 h-[calc(100%-28px)]">
                <div className="space-y-3">
                  <div>
                    <p className="text-sm text-muted-foreground">Tên nhà cung cấp:</p>
                    <p className="font-medium">{importHistory.supplier.name}</p>
                  </div>
                  <div>
                    <p className="text-sm text-muted-foreground">Mã nhà cung cấp:</p>
                    <p className="font-medium">#{importHistory.supplier.id}</p>
                  </div>
                  <Separator className="my-2" />
                  <div>
                    <p className="text-sm text-muted-foreground">Mô tả:</p>
                    <div className="max-h-[180px] overflow-y-auto mt-1 pr-1">
                      <p className="text-sm whitespace-pre-line">
                        {importHistory.supplier.description}
                      </p>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Product Details Table */}
      <Card className="border-0 shadow-md">
        <CardHeader className="pb-0">
          <CardTitle className="text-lg font-semibold flex items-center gap-2">
            <ShoppingBag className="h-5 w-5" />
            Chi tiết sản phẩm nhập
          </CardTitle>
          <CardDescription>
            Danh sách {importHistory.importDetails.length} sản phẩm trong phiếu nhập hàng
          </CardDescription>
        </CardHeader>
        <CardContent className="p-6">
          <div className="rounded-lg border overflow-hidden">
            <Table>
              <TableHeader className="bg-muted/50">
                <TableRow>
                  <TableHead className="w-[40%]">Sản phẩm</TableHead>
                  <TableHead>Đơn giá</TableHead>
                  <TableHead>Số lượng</TableHead>
                  <TableHead className="text-right">Thành tiền</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {importHistory.importDetails.map((detail) => (
                  <TableRow key={detail.id}>
                    <TableCell>
                      <div className="flex items-center gap-3">
                        <div className="w-12 h-12 rounded-md overflow-hidden flex-shrink-0 border bg-muted/20">
                          <img
                            src={detail.product.image}
                            alt={detail.product.name}
                            className="w-full h-full object-cover"
                          />
                        </div>
                        <div>
                          <p className="font-medium text-sm">{detail.product.name}</p>
                          <div className="flex items-center gap-1 mt-1">
                            <Badge variant="outline" className="px-1 h-5 text-xs font-normal">
                              ID: {detail.product.id}
                            </Badge>
                            <Badge 
                              variant="secondary" 
                              className="px-1 h-5 text-xs font-normal"
                            >
                              {detail.product.status}
                            </Badge>
                          </div>
                        </div>
                      </div>
                    </TableCell>
                    <TableCell>{formatPrice(detail.price)}</TableCell>
                    <TableCell>{detail.quantity}</TableCell>
                    <TableCell className="text-right font-medium">
                      {formatPrice(detail.totalPrice)}
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
              <tfoot>
                <tr className="border-t">
                  <td colSpan={3} className="px-4 py-3 text-right font-semibold">
                    Tổng tiền:
                  </td>
                  <td className="px-4 py-3 text-right font-semibold text-primary">
                    {formatPrice(importHistory.totalPrice)}
                  </td>
                </tr>
              </tfoot>
            </Table>
          </div>
        </CardContent>
      </Card>

      {/* Additional Information */}
      <Card className="border-0 shadow-md">
        <CardHeader className="pb-0">
          <CardTitle className="text-lg font-semibold flex items-center gap-2">
            <FileText className="h-5 w-5" />
            Thông tin bổ sung
          </CardTitle>
        </CardHeader>
        <CardContent className="p-6">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="p-4 bg-muted/50 rounded-lg">
              <p className="text-sm text-muted-foreground">Ngày tạo:</p>
              <p className="font-medium">{formatDate(importHistory.createdAt)}</p>
            </div>
            <div className="p-4 bg-muted/50 rounded-lg">
              <p className="text-sm text-muted-foreground">Ngày cập nhật:</p>
              <p className="font-medium">{formatDate(importHistory.updatedAt)}</p>
            </div>
            <div className="p-4 bg-muted/50 rounded-lg">
              <p className="text-sm text-muted-foreground">Người cập nhật:</p>
              <p className="font-medium">{importHistory.updatedBy}</p>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default ImportDetailView; 