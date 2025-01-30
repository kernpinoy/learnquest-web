"use client";

import { useForm } from "react-hook-form";
import type { DeleteClassroom } from "~/lib/validation/delete-classroom";
import { resolver, defaultValues } from "~/lib/validation/delete-classroom";

export function useDeleteClassroomForm(classCode: string) {
  return useForm<DeleteClassroom>({
    resolver,
    defaultValues: defaultValues(classCode),
  });
}
