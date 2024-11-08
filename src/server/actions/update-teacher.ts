"use server";

import { createSafeActionClient } from "next-safe-action";
import { updateTeacherInfoSchema } from "~/lib/validation/update-teacher-info";
import { updateTeacherInfo as updateTeacher } from "../functions/teachers";
import { revalidatePath } from "next/cache";
import { db } from "../db";
import { validateRequest } from "~/lib/validate-request";

const action = createSafeActionClient();

export const updateTeacherInfo = action
  .schema(updateTeacherInfoSchema)
  .action(async ({ parsedInput: { firstName, middleName, lastName } }) => {
    const { session, user } = await validateRequest();

    if (!session || !user) {
      return { error: "Unauthorized" };
    }

    const result = await db.transaction(async (tx) => {
      try {
        await updateTeacher(firstName, middleName, lastName, user.id);
        return { success: "Personal information updated successfully." };
      } catch (error) {
        tx.rollback();
        return { error: "Failed to update personal information." };
      }
    });

    if (result.error) {
      return { error: result.error };
    }

    revalidatePath("/dashboard/teacher/settings");
    return { success: result.success };
  });
