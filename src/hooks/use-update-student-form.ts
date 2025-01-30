"use client";

import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import {
  updateStudentFormSchema,
  defaultValues,
} from "~/lib/validation/update-student-info"; // Adjust the import path as needed

export function useUpdateStudentForm(
  lrn: string,
  firstName: string,
  middleName: string,
  lastName: string,
  sex: "male" | "female",
) {
  return useForm({
    resolver: zodResolver(updateStudentFormSchema),
    defaultValues: defaultValues(lrn, firstName, middleName, lastName, sex),
  });
}
