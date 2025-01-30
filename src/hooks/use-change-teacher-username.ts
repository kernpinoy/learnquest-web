"use client";

import { useForm } from "react-hook-form";
import {
  ChangeUsername,
  resolver,
  defaultValues,
} from "~/lib/validation/change-teacher-username";

export default function useChangeTeacherUsername(userId: string) {
  return useForm<ChangeUsername>({
    resolver,
    defaultValues: defaultValues(userId),
  });
}
