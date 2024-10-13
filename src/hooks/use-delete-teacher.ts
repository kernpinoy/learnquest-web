"use client";

import { useForm } from "react-hook-form";
import {
  DeleteTeacher,
  resolver,
  defaultValues,
} from "~/lib/validation/delete-teacher";

export default function useDeleteTeacher(teacherId: string) {
  return useForm<DeleteTeacher>({
    resolver,
    defaultValues: defaultValues(teacherId),
  });
}
