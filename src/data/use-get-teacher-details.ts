import { useQuery } from "@tanstack/react-query";
import { getTeacherDetails } from "~/server/functions/teachers";

export function useGetTeacherDetails() {
  return useQuery({
    queryFn: async () => getTeacherDetails(),
    queryKey: ["admin-teachers-card"],
  });
}
