"use server";

import { createSafeActionClient } from "next-safe-action";
import { validateRequest } from "~/lib/validate-request";
import { deleteStudentSchema } from "~/lib/validation/delete-student";
import { db } from "../db";
import { users } from "../db/schema";
import { eq } from "drizzle-orm";
import { revalidatePath } from "next/cache";

const action = createSafeActionClient();

export const deleteStudentAction = action
  .schema(deleteStudentSchema)
  .action(async ({ parsedInput: { studentId } }) => {
    const { session, user } = await validateRequest();

    if (!session || !user) {
      throw new Error("Unauthorized.");
    }

    const result = await db.transaction(async (tx) => {
      try {
        // student id here is lrn, too lazy to redefine zod schema
        // lrn is considered username of student
        const existingUser = await tx
          .select({ userId: users.id })
          .from(users)
          .where(eq(users.username, studentId));

        if (!existingUser) {
          return { error: "Student does not exist. Invalid" };
        }

        // now delete
        await tx.delete(users).where(eq(users.username, studentId));
        return { success: "Student deleted successfully." };
      } catch (e) {
        tx.rollback();
        return { error: "Something went wrong. Please try again later." };
      }
    });

    if (result?.error) {
      throw new Error(result.error);
    }

    // revalidate path
    revalidatePath("/dashboard/teacher/[classCode]", "page");
    return { success: result.success };
  });
