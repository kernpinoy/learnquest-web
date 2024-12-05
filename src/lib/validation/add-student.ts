import { zodResolver } from "@hookform/resolvers/zod";
import { transform } from "framer-motion";
import { z } from "zod";

// Add student schema
export const addStudentFormSchema = z.object({
  lrn: z
    .string()
    .refine((value) => /^[0-9]+$/.test(value), {
      message: "LRN must contain only numeric digits.",
    })
    .refine((value) => value.length === 12, {
      message: "LRN must be exactly 12 digits long.",
    }),
  firstName: z.string().min(1, "First name is required."),
  middleName: z.string().min(1, "Middle name is required."),
  lastName: z.string().min(1, "Last name is required."),
  sex: z.enum(["male", "female"], {
    errorMap: () => ({ message: "Please select a sex (Male or Female)." }),
  }),
  password: z.string().min(1, "Password is required."),
  classCode: z.string().min(1, "Classroom ID is needed."),
});

export type AddStudent = z.infer<typeof addStudentFormSchema>;
export const resolver = zodResolver(addStudentFormSchema);
export const defaultValues: AddStudent = {
  lrn: "",
  firstName: "",
  middleName: "",
  lastName: "",
  sex: "female",
  password: "",
  classCode: "",
};
