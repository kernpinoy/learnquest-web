import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";

export const deleteClassroomSchema = z.object({
  classCode: z.string(),
});

export type DeleteClassroom = z.infer<typeof deleteClassroomSchema>;
export const resolver = zodResolver(deleteClassroomSchema);

export const defaultValues = (classCode: string): DeleteClassroom => {
  return {
    classCode,
  };
};
