import { z } from "zod";

// Step 1: Define the validation schema for unarchiving a classroom
export const unarchiveClassroomSchema = z.object({
  classroomId: z.string(),
});

export type UnarchiveClassroom = z.infer<typeof unarchiveClassroomSchema>;
