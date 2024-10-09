"use client";

import { useForm } from "react-hook-form";
import { ResetAccount, resolver } from "~/lib/validation/reset-account";

export default function useResetTeacherPassword(teacherId: string) {
  return useForm<ResetAccount>({
    resolver,
    defaultValues: {
      userId: teacherId,
      confirmPassword: "",
      password: "",
    },
  });
}
