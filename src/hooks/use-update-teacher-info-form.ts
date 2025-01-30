"use client";

import { useForm } from "react-hook-form";
import {
  resolver,
  type UpdateTeacherInfo,
} from "~/lib/validation/update-teacher-info";

export default function useUpdateTeacherInfoForm(values?: UpdateTeacherInfo) {
  return useForm<UpdateTeacherInfo>({ resolver, defaultValues: values });
}
