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
    })
    .transform((str) => str.trim()),
  firstName: z
    .string()
    .min(1, "First name is required")
    .regex(
      /^[A-Za-z\s'-]+$/,
      "First name must not contain numbers or special characters.",
    )
    .transform((str) => {
      return str
        .trim()
        .split(" ")
        .map(
          (word) => word.charAt(0).toUpperCase() + word.slice(1).toLowerCase(),
        )
        .join(" ");
    }),
  middleName: z
    .string()
    .min(1, "Middle name is required")
    .regex(
      /^[A-Za-z\s'-]+$/,
      "Middle name must not contain numbers or special characters.",
    )
    .transform((str) => {
      return str
        .trim()
        .split(" ")
        .map((word) => {
          // Special handling for particles like "dela", "de", "van", etc.
          const lowerWord = word.toLowerCase();
          if (["van", "von"].includes(lowerWord)) {
            return lowerWord;
          }
          return word.charAt(0).toUpperCase() + word.slice(1).toLowerCase();
        })
        .join(" ");
    }),
  lastName: z
    .string()
    .min(1, "Last name is required")
    .regex(
      /^[A-Za-z\s'-]+$/,
      "Last name must not contain numbers or special characters.",
    )
    .transform((str) => {
      return str
        .trim()
        .split(" ")
        .map((word) => {
          const lowerWord = word.toLowerCase();
          if (["van", "von"].includes(lowerWord)) {
            return lowerWord;
          }
          return word.charAt(0).toUpperCase() + word.slice(1).toLowerCase();
        })
        .join(" ");
    }),
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
