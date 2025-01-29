import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";

export const archiveClassroomFormSchema = z.object({
  teacherId: z.string().min(1, "User ID must be present"),
});

export type ArchiveClassroom = z.infer<typeof archiveClassroomFormSchema>;

export const resolver = zodResolver(archiveClassroomFormSchema);

export const defaultValues = (teacherId: string): ArchiveClassroom => {
  return {
    teacherId: teacherId,
  };
};
