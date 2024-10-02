import { useQuery } from "@tanstack/react-query";
import { getTeacherClassroom } from "~/server/functions/teachers";

export function useGetTeacherClassroom(username: string) {
  return useQuery({
    queryKey: ["teacher-classroom", username],
    queryFn: async () => getTeacherClassroom(username),
  });
}
