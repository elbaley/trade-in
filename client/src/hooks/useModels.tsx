import type { ModelsGetResponse } from "@/lib/apiTypes";
import { useQuery } from "@tanstack/react-query";

const fetchModels = async (
  companyId?: number | null,
): Promise<ModelsGetResponse> => {
  const response = companyId
    ? await fetch(
        `${import.meta.env.VITE_API_URL}/models?companyId=${companyId}`,
      )
    : await fetch(`${import.meta.env.VITE_API_URL}/models`);
  return await response.json();
};

type ModelProps = {
  companyId?: number | null;
};
export const useModels = ({ companyId }: ModelProps) => {
  return useQuery({
    queryKey: ["modelsList", companyId],
    queryFn: () => {
      return fetchModels(companyId);
    },
  });
};
