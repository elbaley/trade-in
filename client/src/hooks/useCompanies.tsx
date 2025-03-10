import type { CompaniesGetResponse } from "@/lib/apiTypes";
import { useQuery } from "@tanstack/react-query";

const fetchCompanies = async (): Promise<CompaniesGetResponse> => {
  const response = await fetch(`${import.meta.env.VITE_API_URL}/companies`);
  return await response.json();
};

export const useCompanies = () => {
  return useQuery({
    queryKey: ["companiesList"],
    queryFn: fetchCompanies,
  });
};
