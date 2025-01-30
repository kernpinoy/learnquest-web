import { useQuery } from "@tanstack/react-query";
import { getUploadedFiles } from "~/server/functions/uploads";

export default function useGetUploadedFiles(classCode: string) {
  return useQuery({
    queryKey: ["teacher-classroom-file-uploads", classCode],
    queryFn: () => getUploadedFiles(classCode),
  });
}
