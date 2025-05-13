import { useQuery } from "@tanstack/react-query";
import { fetchImportDetails } from "../api/importApi";

export const useImportDetails = (id: number) => {
  return useQuery({
    queryKey: ["import", id],
    queryFn: () => fetchImportDetails(id),
    enabled: !!id,
  });
};

export default useImportDetails; 