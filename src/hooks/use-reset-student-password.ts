"use client";

import { useForm } from "react-hook-form";
import { ResetAccount, resolver } from "~/lib/validation/reset-account";

export default function useResetStudentPassword(userId: string) {
  return useForm<ResetAccount>({
    resolver,
    defaultValues: {
      userId,
      confirmPassword: "",
      password: "",
    },
  });
}
