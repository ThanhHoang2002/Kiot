import { useQuery } from "@tanstack/react-query";
import { fetchImports, ImportParams } from "../api/importApi";

export const useImports = (params: ImportParams) => {
  return useQuery({
    queryKey: ["imports", params],
    queryFn: () => fetchImports(params),
  });
};

export default useImports; 