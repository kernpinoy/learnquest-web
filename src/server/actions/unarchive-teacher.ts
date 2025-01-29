"use server";

import { createSafeActionClient } from "next-safe-action";
import { unarchiveTeacherSchema } from "~/lib/validation/unarchive-teacher";
import { db } from "../db";
import { revalidatePath } from "next/cache";
import { validateRequest } from "~/lib/validate-request";
import { classrooms, studentsInfo, teachersInfo, users } from "../db/schema";
import { eq } from "drizzle-orm";

const action = createSafeActionClient();

export const unarchiveTeacherAction = action
  .schema(unarchiveTeacherSchema)
  .action(async ({ parsedInput: { teacherId } }) => {
    const result = await db.transaction(async (tx) => {
      const { session, user } = await validateRequest();

      if (!session || !user) {
        return {
          error: "Unauthenticated.",
        };
      }

      if (user.role !== "admin") {
        return {
          error: "Not an admin.",
        };
      }

      try {
        const teacher = await tx.query.teachersInfo.findFirst({
          where: eq(teachersInfo.id, teacherId),
        });

        if (!teacher) {
          return {
            error: "Teacher not found.",
          };
        }

        const teacherClassrooms = await tx.query.classrooms.findMany({
          where: eq(classrooms.teacherId, teacher.id),
        });

        if (teacherClassrooms.length > 0) {
          for (const teacherClassroom of teacherClassrooms) {
            await tx
              .update(classrooms)
              .set({ archived: false, archivedAt: null })
              .where(eq(classrooms.id, teacherClassroom.id));

            const classroomStudents = await tx.query.studentsInfo.findMany({
              where: eq(studentsInfo.classroomId, teacherClassroom.id),
            });

            if (classroomStudents.length > 0) {
              for (const student of classroomStudents) {
                await tx
                  .update(studentsInfo)
                  .set({ archived: false, archivedAt: null })
                  .where(eq(studentsInfo.id, student.id));

                await tx
                  .update(users)
                  .set({ archived: false, archivedAt: null })
                  .where(eq(users.id, student.userId));
              }
            }
          }
        }

        await tx
          .update(users)
          .set({ archived: false, archivedAt: null })
          .where(eq(users.id, teacher.userId));

        await tx
          .update(teachersInfo)
          .set({ archived: false, archivedAt: null })
          .where(eq(teachersInfo.id, teacher.id));

        return { success: "Teacher account has been unarchived successfully" };
      } catch (error) {
        tx.rollback();
        return { error: "Failed to unarchive teacher account" };
      }
    });

    if (result.error) {
      return { error: result.error };
    }

    // revalidate path
    revalidatePath("/dashboard/admin/archives/teacher", "page");
    return { success: result.success };
  });
