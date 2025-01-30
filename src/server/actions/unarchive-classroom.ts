"use server";

import { createSafeActionClient } from "next-safe-action";
import { db } from "../db";
import { revalidatePath } from "next/cache";
import { validateRequest } from "~/lib/validate-request";
import { classrooms, studentsInfo, teachersInfo, users } from "../db/schema";
import { eq } from "drizzle-orm";
import { unarchiveClassroomSchema } from "~/lib/validation/unarchive-classroom"; // Update with correct schema

const action = createSafeActionClient();

export const unarchiveClassroomAction = action
  .schema(unarchiveClassroomSchema)
  .action(async ({ parsedInput: { classroomId } }) => {
    const { session, user } = await validateRequest();

    if (!session || !user) {
      return { error: "Unauthorized" };
    }

    const result = await db.transaction(async (tx) => {
      try {
        // Grab classroom from db
        const classroom = await tx.query.classrooms.findFirst({
          where: eq(classrooms.id, classroomId),
        });

        if (!classroom) {
          return { error: "Classroom does not exist." };
        }

        // Grab teacher via classCode
        const teacher = await tx.query.teachersInfo.findFirst({
          where: eq(teachersInfo.id, classroom.teacherId),
        });

        if (!teacher) {
          return { error: "Teacher does not exist." };
        }

        // Grab students
        const students = await tx.query.studentsInfo.findMany({
          where: eq(studentsInfo.classroomId, classroom.id),
        });

        // Unarchive all students if they are archived
        if (students.length > 0) {
          for (const student of students) {
            if (student.archived) {
              await tx
                .update(users)
                .set({ archived: false, archivedAt: null })
                .where(eq(users.id, student.userId));

              await tx
                .update(studentsInfo)
                .set({ archived: false, archivedAt: null })
                .where(eq(studentsInfo.id, student.id));
            }
          }
        }

        // Unarchive classroom if it is archived
        if (classroom.archived) {
          await tx
            .update(classrooms)
            .set({ archived: false, archivedAt: null })
            .where(eq(classrooms.id, classroom.id));
        }

        return {
          success: "Classroom unarchived successfully.",
        };
      } catch (error) {
        console.log(error);
        tx.rollback();
        return { error: "Something went wrong. Please try again later." };
      }
    });

    if (result.error) {
      return {
        error: result.error,
      };
    }

    revalidatePath("/dashboard/admin/[username]/[classCode]", "page");
    return {
      success: result.success,
    };
  });
