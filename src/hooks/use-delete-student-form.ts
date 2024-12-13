"use client";

import { useForm } from "react-hook-form";
import {
  DeleteStudent,
  resolver,
  defaultValues,
} from "~/lib/validation/delete-student";

export function useDeleteStudentForm(lrn: string) {
  return useForm<DeleteStudent>({
    resolver: resolver,
    defaultValues: defaultValues(lrn),
  });
}
