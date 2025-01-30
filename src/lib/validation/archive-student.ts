import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";

export const archiveStudentSchema = z.object({
  studentId: z.string(),
});

export type ArchiveStudent = z.infer<typeof archiveStudentSchema>;
export const resolver = zodResolver(archiveStudentSchema);

export const defaultValues = (studentId: string): ArchiveStudent => {
  return {
    studentId,
  };
};
