import { useQuery } from "@tanstack/react-query";
import { getAllPlans } from "../services/plan.service";

export const usePlans = () => {
  return useQuery({
    queryKey: ["plans"],
    queryFn: getAllPlans,
    staleTime: 1000 * 60 * 5, // Cache for 5 minutes
  });
};
