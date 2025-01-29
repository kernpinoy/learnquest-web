"use server";

import { createSafeActionClient } from "next-safe-action";
import { db } from "../db";
import { revalidatePath } from "next/cache";
import { validateRequest } from "~/lib/validate-request";
import { classrooms, studentsInfo, teachersInfo, users } from "../db/schema";
import { eq } from "drizzle-orm";
import { archiveClassroomFormSchema } from "~/lib/validation/archive-classroom";

const action = createSafeActionClient();

export const archiveClassroomAction = action
  .schema(archiveClassroomFormSchema)
  .action(async ({ parsedInput: { classCode } }) => {
    const { session, user } = await validateRequest();

    if (!session || !user) {
      return { error: "Unauthorized" };
    }

    const result = await db.transaction(async (tx) => {
      try {
        // grab classroom from db
        const classroom = await tx.query.classrooms.findFirst({
          where: eq(classrooms.classCode, classCode),
        });

        if (!classroom) {
          return { error: "Classroom does not exist." };
        }

        // grab teacher via classCode
        const teacher = await tx.query.teachersInfo.findFirst({
          where: eq(teachersInfo.id, classroom.teacherId),
        });

        if (!teacher) {
          return { error: "Teacher does not exist." };
        }

        // grab studs
        const students = await tx.query.studentsInfo.findMany({
          where: eq(studentsInfo.classroomId, classroom.id),
        });

        const date = new Date();

        // archive all studs if they have
        if (students.length > 0) {
          for (const student of students) {
            await tx
              .update(users)
              .set({ archived: true, archivedAt: date })
              .where(eq(users.id, student.userId));

            await tx
              .update(studentsInfo)
              .set({ archived: true, archivedAt: date })
              .where(eq(studentsInfo.id, student.id));
          }
        }

        // archive classroom finally
        await tx
          .update(classrooms)
          .set({ archived: true, archivedAt: date })
          .where(eq(classrooms.id, classroom.id));

        return {
          success: "Classroom archived successfully.",
        };
      } catch (error) {
        console.log(error);
        tx.rollback();
        return { error: "Something went wrong. Please try again later." };
      }
    });

    // Revalidate paths to update client-side cache
    revalidatePath("/dashboard/teacher/[classCode]", "page");
    revalidatePath("/dashboard/admin/[username]/[classCode]", "page");

    if (result.error) {
      return {
        error: result.error,
      };
    }

    return {
      success: result.success,
      nextPath:
        user.role === "teacher" ? "/dashboard/teacher" : "/dashboard/admin",
    };
  });
