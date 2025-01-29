import { useQuery } from "@tanstack/react-query";
import { getArchivedClassroomsByTeacher } from "~/server/functions/classroom";
import { getArchiveTeachers } from "~/server/functions/teachers";

export function useGetArchivedClassrooms(teacherId: string) {
  return useQuery({
    queryKey: ["teacher-archived-classrooms", teacherId],
    queryFn: async () => getArchivedClassroomsByTeacher(teacherId),
  });
}
