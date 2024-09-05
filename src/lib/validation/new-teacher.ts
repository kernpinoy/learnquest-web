import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";

// Teacher register form schema
export const addTeacherFormSchema = z
  .object({
    firstName: z
      .string()
      .min(1, "First name must not be empty.")
      .transform((str) => str.trim()),
    middleName: z
      .string()
      .min(1, "Middle name must not be empty.")
      .transform((str) => str.trim()),
    lastName: z
      .string()
      .min(1, "Last name must not be empty.")
      .transform((str) => str.trim()),
    username: z
      .string()
      .min(1, "Username must not be empty.")
      .transform((str) => str.trim()),
    password: z.string().min(1, "Password must not be empty."),
    confirmPassword: z.string().min(1, "Password must not be empty."),
  })
  .refine((data) => data.password === data.confirmPassword, {
    message: "Passwords do not match.",
    path: ["confirmPassword"],
  });

// Infer type of registration form
export type AddTeacher = z.infer<typeof addTeacherFormSchema>;

// Export resolver
export const resolver = zodResolver(addTeacherFormSchema);

// Export default values
export const defaultValues: AddTeacher = {
  firstName: "",
  middleName: "",
  lastName: "",
  username: "",
  password: "",
  confirmPassword: "",
};
