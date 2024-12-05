"use client";
import { useForm } from "react-hook-form";
import {
  addStudentFormSchema,
  defaultValues,
  resolver,
  type AddStudent,
} from "~/lib/validation/add-student";

export function useAddStudentForm(overrideValues: Partial<AddStudent> = {}) {
  return useForm<AddStudent>({
    resolver,
    defaultValues: {
      ...defaultValues,
      ...overrideValues,
    },
  });
}
