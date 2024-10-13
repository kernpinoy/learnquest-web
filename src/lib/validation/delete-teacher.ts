import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";

export const deleteTeacherFormSchema = z.object({
  userId: z.string().min(1, "User ID must be present"),
});

export type DeleteTeacher = z.infer<typeof deleteTeacherFormSchema>;

export const resolver = zodResolver(deleteTeacherFormSchema);

export const defaultValues = (userId: string): DeleteTeacher => {
  return {
    userId,
  };
};
