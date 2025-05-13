import { useParams } from "react-router-dom";
import useImportDetails from "@/features/import/hooks/useImportDetails";
import ImportDetailView from "@/features/import/components/detail/ImportDetailView";
import { Button } from "@/components/ui/button";
import { ArrowLeft, Loader2 } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { paths } from "@/config/paths";

const ImportDetailPage = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { data, isLoading, isError } = useImportDetails(Number(id));

  const handleBack = () => {
    navigate(paths.import);
  };

  if (isError) {
    return (
      <div className="p-6">
        <div className="flex items-center mb-6">
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
            <span className="font-medium text-foreground">Chi tiết nhập hàng</span>
          </div>
        </div>
        
        <div className="flex flex-col items-center justify-center h-[50vh] bg-white rounded-lg border border-gray-200 shadow-sm">
          <div className="text-red-500 text-xl font-medium mb-2">Đã xảy ra lỗi</div>
          <p className="text-muted-foreground">Không thể tải thông tin chi tiết nhập hàng</p>
          <Button 
            variant="outline" 
            className="mt-4"
            onClick={handleBack}
          >
            Quay lại danh sách
          </Button>
        </div>
      </div>
    );
  }

  return (
    <div className="p-6">
      <div className="flex items-center mb-6">
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
          <span className="font-medium text-foreground">Chi tiết nhập hàng {id && `#${id}`}</span>
        </div>
      </div>
      
      {isLoading ? (
        <div className="flex flex-col items-center justify-center h-[50vh] bg-white rounded-lg border border-gray-200 shadow-sm">
          <Loader2 className="h-8 w-8 animate-spin text-primary mb-2" />
          <p className="text-muted-foreground">Đang tải thông tin chi tiết...</p>
        </div>
      ) : (
        <ImportDetailView importHistory={data!} isLoading={false} />
      )}
    </div>
  );
};

export default ImportDetailPage; 