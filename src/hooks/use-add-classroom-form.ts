"use client";

import { useForm } from "react-hook-form";
import type { AddClassroom } from "~/lib/validation/add-classroom";
import { resolver, defaultValues } from "~/lib/validation/add-classroom";

export function useAddClassroomForm(userId: string) {
  return useForm<AddClassroom>({
    resolver,
    defaultValues: defaultValues(userId),
  });
}
