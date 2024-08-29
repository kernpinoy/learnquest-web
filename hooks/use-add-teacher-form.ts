"use client";

import { useForm } from "react-hook-form";
import type { AddTeacherFormType } from "~/lib/forms/add-new-teacher-form";
import { resolver, defaultValues } from "~/lib/forms/add-new-teacher-form";

export function useAddTeacherForm() {
  return useForm<AddTeacherFormType>({
    resolver,
    defaultValues,
  });
}
