"use client";

import { useForm } from "react-hook-form";
import type { AddTeacher } from "~/lib/validation/add-teacher";
import { resolver, defaultValues } from "~/lib/validation/add-teacher";

export function useAddTeacherForm() {
  return useForm<AddTeacher>({
    resolver,
    defaultValues,
  });
}
