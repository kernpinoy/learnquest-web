import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";

export const deleteStudentSchema = z.object({
  studentId: z.string(),
});

export type DeleteStudent = z.infer<typeof deleteStudentSchema>;
export const resolver = zodResolver(deleteStudentSchema);

export const defaultValues = (studentId: string): DeleteStudent => {
  return {
    studentId,
  };
};
