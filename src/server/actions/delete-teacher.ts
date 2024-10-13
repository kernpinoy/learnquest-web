"use server";

import { createSafeActionClient } from "next-safe-action";
import { deleteTeacherFormSchema } from "~/lib/validation/delete-teacher";
import { deleteTeacher } from "../functions/teachers";
import { db } from "../db";
import { revalidatePath } from "next/cache";

const action = createSafeActionClient();

export const deleteTeacherAction = action
  .schema(deleteTeacherFormSchema)
  .action(async ({ parsedInput: { userId: teacherId } }) => {
    const result = await db.transaction(async (tx) => {
      try {
        await deleteTeacher(teacherId);

        return { success: `Teacher deleted successfully.` };
      } catch (error) {
        tx.rollback();
        return { error: "Something went wrong. Please try again later." };
      }
    });

    if (result.error) {
      return { error: result.error };
    }

    revalidatePath("/dashboard/admin");
    return { success: result.success };
  });
