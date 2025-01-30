"use client";

import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import {
  UnarchiveTeacher,
  unarchiveTeacherSchema,
} from "~/lib/validation/unarchive-teacher";

export default function useUnarchiveTeacher(teacherId: string) {
  const form = useForm<UnarchiveTeacher>({
    resolver: zodResolver(unarchiveTeacherSchema),
    defaultValues: {
      teacherId,
    },
  });

  return form;
}
