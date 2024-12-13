import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";

export const addClassroomSchema = z.object({
  name: z
    .string()
    .min(1, "Name must not be empty.")
    .regex(/^[^\d]*$/, "Name must not contain numbers.")
    .transform((str) => str.trim()),
  classSession: z.enum(["morning", "afternoon"]).default("morning"),
  schoolYear: z
    .string()
    .regex(
      /^\d{4}\s?-\s?\d{4}$/,
      "School year must be in format YYYY - YYYY or YYYY-YYYY.",
    )
    .transform((year) => {
      const [start, end] = year.split("-").map((str) => str.trim());
      return `${start} - ${end}`;
    })
    .refine((years) => {
      const [startYear, endYear] = years
        .split("-")
        .map((str) => parseInt(str.trim()));

      return endYear === startYear + 1;
    }, "End year must be one year after start year."),
  maxStudents: z
    .number()
    .int("Max students must be a valid integer.")
    .positive("Max students must be a positive integer.")
    .min(1, "Classroom must allow at least one student.")
    .max(100, "Classroom is up to 100 only."),
});

export type AddClassroom = z.infer<typeof addClassroomSchema>;
export const resolver = zodResolver(addClassroomSchema);

export const defaultValues: AddClassroom = {
  name: "",
  classSession: "morning",
  schoolYear: `${new Date().getFullYear()} - ${new Date().getFullYear() + 1}`,
  maxStudents: 1,
};
