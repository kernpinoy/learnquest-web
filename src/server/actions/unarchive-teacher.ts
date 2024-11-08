"use server";

import { createSafeActionClient } from "next-safe-action";
import { unarchiveTeacherSchema } from "~/lib/validation/unarchive-teacher";
import { unarchiveTeacher } from "~/server/functions/teachers";
import { db } from "../db";
import { revalidatePath } from "next/cache";

const action = createSafeActionClient();

export const unarchiveTeacherAction = action
  .schema(unarchiveTeacherSchema)
  .action(async ({ parsedInput: { teacherId} }) => {
    const result = await db.transaction(async (tx) => {
      try {
        await unarchiveTeacher(teacherId);
        return { success: "Teacher account has been unarchived successfully" };
      } catch (error) {
        tx.rollback();
        return { error: "Failed to unarchive teacher account" };
      }
    });

    if (result.error) {
      return { error: result.error };
    }

    revalidatePath("/dashboard/admin/archives/teacher");
    return { success: result.success };
  });
