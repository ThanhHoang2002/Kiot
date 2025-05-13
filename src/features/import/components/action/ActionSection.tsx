import { Button } from "@/components/ui/button";
import { Plus } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { paths } from "@/config/paths";

const ActionSection = () => {
  const navigate = useNavigate();
  const handleCreateImport = () => {
    navigate(paths.importCreate);
  };

  return (
    <div className="flex flex-col md:flex-row gap-4 justify-end">
      <Button onClick={handleCreateImport}>
        <Plus className="mr-2 h-4 w-4" />
        Tạo phiếu nhập
      </Button>
    </div>
  );
};

export default ActionSection; 