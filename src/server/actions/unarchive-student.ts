"use server";

import { createSafeActionClient } from "next-safe-action";
import { validateRequest } from "~/lib/validate-request";
import { unArchiveStudentSchema } from "~/lib/validation/unarchive-student";
import { db } from "../db";
import { classrooms, studentsInfo, users } from "../db/schema";
import { eq } from "drizzle-orm";
import { revalidatePath } from "next/cache";

const action = createSafeActionClient();

export const unarchiveStudentAction = action
  .schema(unArchiveStudentSchema)
  .action(async ({ parsedInput: { studentId } }) => {
    const { session, user } = await validateRequest();

    if (!session || !user) {
      throw new Error("Unauthorized.");
    }

    const result = await db.transaction(async (tx) => {
      try {
        // student id here is lrn, too lazy to redefine zod schema
        // lrn is considered username of student

        const [existingUser] = await tx
          .select({ username: users.username, userId: users.id })
          .from(users)
          .where(eq(users.username, studentId));

        if (!existingUser) {
          return { error: "Student does not exist. Invalid" };
        }

        console.log(existingUser);

        const [classroom] = await tx
          .select({
            classCode: classrooms.classCode,
          })
          .from(classrooms)
          .innerJoin(studentsInfo, eq(studentsInfo.userId, existingUser.userId)) // Join with studentsInfo
          .where(eq(studentsInfo.userId, existingUser.userId)); // Use userId to filter

        console.log(classroom.classCode);

        // now update
        await tx
          .update(users)
          .set({ archived: false, archivedAt: null })
          .where(eq(users.username, existingUser.username));

        await tx
          .update(studentsInfo)
          .set({ archived: false, archivedAt: null })
          .where(eq(studentsInfo.userId, existingUser.userId));

        return {
          success: "Student unarchived successfully.",
          classCode: classroom.classCode,
        };
      } catch (e) {
        tx.rollback();
        return { error: "Something went wrong. Please try again later." };
      }
    });

    if (result?.error) {
      throw new Error(result.error);
    }

    // revalidate path
    if (user.role === "admin") {
      revalidatePath("/dashboard/admin/[username]/[classCode]", "page");
    } else {
      revalidatePath("/dashboard/teacher/[classCode]", "page");
    }
    return { success: result.success };
  });
