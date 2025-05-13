import { useMutation, useQueryClient } from "@tanstack/react-query";
import { uploadImportExcel } from "../api/importApi";

export const useUploadImport = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (file: File) => uploadImportExcel(file),
    onSuccess: () => {
      // Invalidate all queries that start with "imports" to ensure all related queries are refreshed
      queryClient.invalidateQueries({ queryKey: ["imports"] });
    },
  });
};

export default useUploadImport; 