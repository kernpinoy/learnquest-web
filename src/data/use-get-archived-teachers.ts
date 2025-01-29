import { useQuery } from "@tanstack/react-query";
import { getArchiveTeachers } from "~/server/functions/teachers";

export function useGetArchiveTeacher() {
  return useQuery({
    queryKey: ["admin-teacher-archived"],
    queryFn: async () => getArchiveTeachers(),
  });
}
