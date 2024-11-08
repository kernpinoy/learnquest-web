import { useQuery } from "@tanstack/react-query";
import { getTeacherInfo } from "~/server/functions/teachers";

export function useGetTeacherInfo(userId: string) {
  return useQuery({
    queryKey: ["teacher-info", userId],
    queryFn: async () => getTeacherInfo(userId),
  });
}
