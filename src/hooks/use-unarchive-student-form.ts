"use client";

import { useForm } from "react-hook-form";
import {
  UnarchiveStudent,
  resolver,
  defaultValues,
} from "~/lib/validation/unarchive-student";

export function useUnArchiveStudentForm(lrn: string) {
  return useForm<UnarchiveStudent>({
    resolver: resolver,
    defaultValues: defaultValues(lrn),
  });
}
