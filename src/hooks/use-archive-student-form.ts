"use client";

import { useForm } from "react-hook-form";
import {
  ArchiveStudent,
  resolver,
  defaultValues,
} from "~/lib/validation/archive-student";

export function useArchiveStudentForm(lrn: string) {
  return useForm<ArchiveStudent>({
    resolver: resolver,
    defaultValues: defaultValues(lrn),
  });
}
