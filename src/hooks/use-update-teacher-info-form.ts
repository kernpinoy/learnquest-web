"use client";

import { useForm } from "react-hook-form";
import {
  resolver,
  type UpdateStudent,
} from "~/lib/validation/update-teacher-info";

export default function useUpdateTeacherInfoForm(values?: UpdateStudent) {
  return useForm<UpdateStudent>({ resolver, defaultValues: values });
}
