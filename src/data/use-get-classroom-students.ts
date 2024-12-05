import { useQuery } from "@tanstack/react-query";
import { getClassroomStudents } from "~/server/functions/classroom";

export function useGetClassroomStudents(classCode: string) {
  return useQuery({
    queryFn: async () => getClassroomStudents(classCode),
    queryKey: ["teacher-classroom-students", classCode],
  });
}
