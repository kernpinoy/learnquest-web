"use client";

import { useForm } from "react-hook-form";
import {
  ArchiveTeacher,
  resolver,
  defaultValues,
} from "~/lib/validation/archive-teacher";

export default function useArchiveTeacher(teacherId: string) {
  return useForm<ArchiveTeacher>({
    resolver,
    defaultValues: defaultValues(teacherId),
  });
}
