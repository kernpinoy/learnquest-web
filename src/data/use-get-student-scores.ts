import { useQuery } from "@tanstack/react-query";
import { getStudentGameScore } from "~/server/functions/classroom";

export function useStudentScore(classCode: string) {
  return useQuery({
    queryFn: async () => getStudentGameScore(classCode),
    queryKey: ["teacher-classroom-students-leaderboards", classCode],
  });
}
