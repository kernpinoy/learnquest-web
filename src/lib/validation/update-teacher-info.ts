import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";

export const updateTeacherInfoSchema = z.object({
  firstName: z
    .string()
    .min(1, "First name is required")
    .transform((str) => {
      return str
        .trim()
        .split(" ")
        .map(
          (word) => word.charAt(0).toUpperCase() + word.slice(1).toLowerCase()
        )
        .join(" ");
    }),
  middleName: z
    .string()
    .min(1, "Middle name is required")
    .transform((str) => {
      return str
        .trim()
        .split(" ")
        .map((word) => {
          // Special handling for particles like "dela", "de", "van", etc.
          const lowerWord = word.toLowerCase();
          if (["dela", "de", "van", "von"].includes(lowerWord)) {
            return lowerWord;
          }
          return word.charAt(0).toUpperCase() + word.slice(1).toLowerCase();
        })
        .join(" ");
    }),
  lastName: z
    .string()
    .min(1, "Last name is required")
    .transform((str) => {
      return str
        .trim()
        .split(" ")
        .map((word) => {
          const lowerWord = word.toLowerCase();
          if (["dela", "de", "van", "von"].includes(lowerWord)) {
            return lowerWord;
          }
          return word.charAt(0).toUpperCase() + word.slice(1).toLowerCase();
        })
        .join(" ");
    }),
});

export type UpdateTeacherInfo = z.infer<typeof updateTeacherInfoSchema>;
export const resolver = zodResolver(updateTeacherInfoSchema);
