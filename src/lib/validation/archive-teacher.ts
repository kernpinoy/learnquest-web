import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";

export const archiveTeacherFormSchema = z.object({
  teacherId: z.string().min(1, "User ID must be present"),
});

export type ArchiveTeacher = z.infer<typeof archiveTeacherFormSchema>;

export const resolver = zodResolver(archiveTeacherFormSchema);

export const defaultValues = (teacherId: string): ArchiveTeacher => {
  return {
    teacherId: teacherId,
  };
};
