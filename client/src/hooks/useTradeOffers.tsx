import type { TradeOffersGetResponse } from "@/lib/apiTypes";
import { useQuery } from "@tanstack/react-query";

const fetchTradeOffers = async (): Promise<TradeOffersGetResponse> => {
  const response = await fetch(`${import.meta.env.VITE_API_URL}/tradeOffers`);
  return await response.json();
};

export const useTradeOffers = () => {
  return useQuery({
    queryKey: ["tradeOffers"],
    queryFn: () => {
      return fetchTradeOffers();
    },
  });
};
