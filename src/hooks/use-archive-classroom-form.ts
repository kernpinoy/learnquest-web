"use client";

import { useForm } from "react-hook-form";
import type { ArchiveClassroom } from "~/lib/validation/archive-classroom";
import { resolver, defaultValues } from "~/lib/validation/archive-classroom";

export function useArchiveClassroomForm(classCode: string) {
  return useForm<ArchiveClassroom>({
    resolver,
    defaultValues: defaultValues(classCode),
  });
}
