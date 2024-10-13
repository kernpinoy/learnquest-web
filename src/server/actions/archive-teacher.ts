"use server";

import { createSafeActionClient } from "next-safe-action";
import { archiveTeacherFormSchema } from "~/lib/validation/archive-teacher";
import { archiveTeacher } from "../functions/teachers";
import { db } from "../db";
import { revalidatePath } from "next/cache";

const action = createSafeActionClient();

export const archiveTeacherAction = action
  .schema(archiveTeacherFormSchema)
  .action(async ({ parsedInput: { teacherId } }) => {
    const result = await db.transaction(async (tx) => {
      try {
        await archiveTeacher(teacherId);

        return { success: `Teacher archived successfully.` };
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
