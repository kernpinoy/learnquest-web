import { useQuery } from "@tanstack/react-query";
import { getTeacherClassroom } from "~/server/functions/teachers";

export function useGetTeacherClassroom(userId: string) {
  return useQuery({
    queryKey: ["teacher-classroom", userId],
    queryFn: async () => getTeacherClassroom(userId),
  });
}
