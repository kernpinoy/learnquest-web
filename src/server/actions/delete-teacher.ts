"use server";

import { createSafeActionClient } from "next-safe-action";
import { deleteTeacherFormSchema } from "~/lib/validation/delete-teacher";
import { deleteTeacher } from "../functions/teachers";
import { db } from "../db";
import { revalidatePath } from "next/cache";
import { validateRequest } from "~/lib/validate-request";
import { lucia } from "~/lib/auth";
import { cookies } from "next/headers";
import { redirect } from "next/navigation";

const action = createSafeActionClient();

export const deleteTeacherAction = action
  .schema(deleteTeacherFormSchema)
  .action(async ({ parsedInput: { userId: teacherId } }) => {
    const { session, user } = await validateRequest();

    if (!session || !user) {
      return { error: "Unauthorized" };
    }

    const result = await db.transaction(async (tx) => {
      try {
        await deleteTeacher(teacherId);

        // Logout only if deleting themselves
        if (user.role === "teacher") {
          // Invalidate session
          await lucia.invalidateSession(session.id);

          // Create blank cookie
          const sessionCookie = lucia.createBlankSessionCookie();

          // Set the cookie
          cookies().set(
            sessionCookie.name,
            sessionCookie.value,
            sessionCookie.attributes
          );

          redirect("/");
        }

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
