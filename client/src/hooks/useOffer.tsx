import type { Selection } from "@/components/getOfferForm/useGetOfferForm";
import type { GetOfferResponse } from "@/lib/apiTypes";
import { useQuery } from "@tanstack/react-query";

const fetchModel = async (
  selections: Selection[],
  modelId: number,
): Promise<GetOfferResponse> => {
  const response = await fetch(
    `${import.meta.env.VITE_API_URL}/tradeOffers/getOffer`,
    {
      method: "POST",
      body: JSON.stringify({ modelId: modelId, selections, deneme: 100 }),
      headers: {
        "Content-Type": "application/json",
      },
    },
  );
  return await response.json();
};

type OfferProps = {
  modelId: number;
  selections: Selection[];
};
export const useOffer = ({ modelId, selections }: OfferProps) => {
  return useQuery({
    queryKey: ["offerGet", modelId],
    queryFn: () => {
      return fetchModel(selections, modelId);
    },
  });
};
