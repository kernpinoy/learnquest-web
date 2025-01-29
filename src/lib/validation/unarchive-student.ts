import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";

export const unArchiveStudentSchema = z.object({
  studentId: z.string(),
});

export type UnarchiveStudent = z.infer<typeof unArchiveStudentSchema>;
export const resolver = zodResolver(unArchiveStudentSchema);

export const defaultValues = (studentId: string): UnarchiveStudent => {
  return {
    studentId,
  };
};
