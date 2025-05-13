import { useState, useRef } from "react";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { ArrowLeft, Upload, FileSpreadsheet, X, Loader2 } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { paths } from "@/config/paths";
import { Input } from "@/components/ui/input";
import { useUploadImport } from "@/features/import/hooks/useUploadImport";
import { useQueryClient } from "@tanstack/react-query";

const CreateImportPage = () => {
  const navigate = useNavigate();
  const { toast } = useToast();
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const queryClient = useQueryClient();
  
  const { mutate: uploadImport, isPending: isUploading } = useUploadImport();

  const handleBack = () => {
    navigate(paths.import);
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files.length > 0) {
      const file = e.target.files[0];
      // Check if file is Excel
      if (!file.name.endsWith('.xlsx') && !file.name.endsWith('.xls')) {
        toast({
          title: "Định dạng file không hợp lệ",
          description: "Vui lòng chọn file Excel (.xlsx, .xls)",
          variant: "destructive",
        });
        return;
      }
      setSelectedFile(file);
    }
  };

  const handleRemoveFile = () => {
    setSelectedFile(null);
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
  };

  const handleSelectFile = () => {
    fileInputRef.current?.click();
  };

  const handleUploadImport = async () => {
    if (!selectedFile) {
      toast({
        title: "Vui lòng chọn file Excel",
        variant: "destructive",
      });
      return;
    }

    uploadImport(selectedFile, {
      onSuccess: async () => {
        toast({
          title: "Tạo phiếu nhập hàng thành công",
          variant: "default",
        });
        
        // Force a refetch of the imports data before navigating
        await queryClient.refetchQueries({ queryKey: ["imports"] });
        
        // Navigate after ensuring data is refreshed
        navigate(paths.import);
      },
      onError: () => {
        toast({
          title: "Tạo phiếu nhập hàng thất bại",
          description: "File không đúng định dạng.",
          variant: "destructive",
        });
      }
    });
  };

  return (
    <div className="p-6 space-y-4">
      <div className="flex items-center mb-4">
        <Button
          variant="outline"
          size="sm"
          onClick={handleBack}
          className="mr-2 gap-1"
        >
          <ArrowLeft className="h-4 w-4" />
          Quay lại
        </Button>
        <div className="flex items-center gap-2 text-sm text-muted-foreground">
          <span>Quản lý nhập hàng</span>
          <span>/</span>
          <span className="font-medium text-foreground">Tạo phiếu nhập</span>
        </div>
      </div>

      <Card className="border-0 shadow-md">
        <CardHeader className="pb-3">
          <CardTitle className="text-xl flex items-center gap-2">
            <FileSpreadsheet className="h-5 w-5 text-primary" />
            Tạo phiếu nhập từ file Excel
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-6">
          <div className="bg-muted/30 rounded-lg p-6 border border-dashed border-muted-foreground/30">
            <Input
              type="file"
              accept=".xlsx,.xls"
              className="hidden"
              ref={fileInputRef}
              onChange={handleFileChange}
            />
            
            {!selectedFile ? (
              <div className="flex flex-col items-center justify-center space-y-3 py-6">
                <div className="rounded-full bg-primary/10 p-3">
                  <Upload className="h-8 w-8 text-primary" />
                </div>
                <div className="text-center">
                  <p className="text-base font-medium">Nhấp hoặc kéo thả file tại đây</p>
                  <p className="text-sm text-muted-foreground">Chỉ hỗ trợ file Excel (.xlsx, .xls)</p>
                </div>
                <Button 
                  variant="outline" 
                  onClick={handleSelectFile}
                  className="mt-2"
                >
                  Chọn file
                </Button>
              </div>
            ) : (
              <div className="flex items-center justify-between bg-primary/5 rounded-lg p-4">
                <div className="flex items-center space-x-3">
                  <FileSpreadsheet className="h-8 w-8 text-primary" />
                  <div>
                    <p className="font-medium truncate max-w-[400px]">{selectedFile.name}</p>
                    <p className="text-sm text-muted-foreground">
                      {(selectedFile.size / 1024).toFixed(2)} KB
                    </p>
                  </div>
                </div>
                <Button 
                  variant="ghost" 
                  size="icon" 
                  onClick={handleRemoveFile}
                  className="text-muted-foreground hover:text-destructive"
                >
                  <X className="h-5 w-5" />
                </Button>
              </div>
            )}
          </div>

          <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4">
            <p className="text-sm text-yellow-800">
              <span className="font-medium">Lưu ý:</span> File Excel phải đúng định dạng theo mẫu. 
              Các cột bắt buộc gồm: Mã sản phẩm, Tên sản phẩm, Giá nhập, Số lượng, Nhà cung cấp.
            </p>
          </div>

          <div className="flex justify-end gap-2 pt-4">
            <Button
              variant="outline"
              onClick={handleBack}
            >
              Hủy
            </Button>
            <Button
              onClick={handleUploadImport}
              disabled={isUploading || !selectedFile}
              className="gap-2"
            >
              {isUploading ? (
                <>
                  <Loader2 className="h-4 w-4 animate-spin" />
                  Đang xử lý...
                </>
              ) : (
                <>
                  <Upload className="h-4 w-4" />
                  Tải lên và tạo phiếu
                </>
              )}
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default CreateImportPage; 