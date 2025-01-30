import { z } from "zod";

export const unarchiveTeacherSchema = z.object({
  teacherId: z.string(),
});

export type UnarchiveTeacher = z.infer<typeof unarchiveTeacherSchema>;