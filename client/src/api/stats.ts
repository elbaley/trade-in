import { StatsResponse } from "@/lib/apiTypes";
import { queryOptions } from "@tanstack/react-query";

export const statsOptions = queryOptions({
  queryKey: ["stats"],
  queryFn: () => fetchStats(),
});

const fetchStats = async (): Promise<StatsResponse> => {
  const response = await fetch(`${import.meta.env.VITE_API_URL}/stats`);

  return await response.json();
};
