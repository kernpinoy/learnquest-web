"use server";
import { createSafeActionClient } from "next-safe-action";
import { addClassroomSchema } from "~/lib/validation/add-classroom";
import { db } from "../db";
import { teachersInfo, classrooms, users } from "../db/schema";
import { revalidatePath } from "next/cache";
import { eq } from "drizzle-orm";
import { validateRequest } from "~/lib/validate-request";

const action = createSafeActionClient();

export const createClassroom = action
  .schema(addClassroomSchema)
  .action(
    async ({
      parsedInput: { name, classSession, maxStudents, schoolYear },
    }) => {
      const { session, user } = await validateRequest();

      if (!session || !user) {
        return {
          error: "Not allowed to do the operation.",
        };
      }

      let teacherResult;

      // Find the teacher ID based on the logged-in user
      teacherResult = await db
        .select({ teacherId: teachersInfo.id })
        .from(teachersInfo)
        .innerJoin(users, eq(teachersInfo.userId, user.id));

      if (teacherResult.length === 0) {
        return {
          error: "Teacher account not found.",
        };
      }

      const teacherId = teacherResult[0].teacherId;

      // Proceed with the transaction to create the classroom
      const result = await db.transaction(async (tx) => {
        try {
          // Insert new classroom record
          const [newClassroom] = await tx
            .insert(classrooms)
            .values({
              name,
              classSession,
              maxStudents,
              schoolYear,
              teacherId,
            })
            .returning();

          return {
            success: "Classroom created successfully.",
            classroom: newClassroom,
          };
        } catch (error) {
          // Rollback if something goes wrong
          tx.rollback();
          return { error: "Something went wrong. Please try again." };
        }
      });

      if (result.error) {
        return { error: result.error };
      }

      // Revalidate the path to update the UI
      revalidatePath("/dashboard/teacher");

      return { success: result.success, classroom: result.classroom };
    }
  );
