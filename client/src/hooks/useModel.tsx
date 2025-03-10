import type { ModelGetResponse } from "@/lib/apiTypes";
import { useQuery } from "@tanstack/react-query";
import { useTranslation } from "react-i18next";

const fetchModel = async (
  lang: string,
  modelId?: number | null,
): Promise<ModelGetResponse> => {
  const response = await fetch(
    `${import.meta.env.VITE_API_URL}/models/${modelId}?lang=${lang === "tr" ? "tr-TR" : "en-US"}`,
  );
  return await response.json();
};

type ModelProps = {
  modelId: number;
};
export const useModel = ({ modelId }: ModelProps) => {
  const { i18n } = useTranslation();
  return useQuery({
    queryKey: ["model", modelId, i18n.language],
    queryFn: () => {
      return fetchModel(i18n.language, modelId);
    },
  });
};
