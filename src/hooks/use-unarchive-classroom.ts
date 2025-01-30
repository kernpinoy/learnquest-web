import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import {
  UnarchiveClassroom,
  unarchiveClassroomSchema,
} from "~/lib/validation/unarchive-classroom";

export default function useUnarchiveClassroom(classroomId: string) {
  const form = useForm<UnarchiveClassroom>({
    resolver: zodResolver(unarchiveClassroomSchema),
    defaultValues: {
      classroomId,
    },
  });

  return form;
}
