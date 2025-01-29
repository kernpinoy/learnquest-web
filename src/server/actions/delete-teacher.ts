"use server";

import { createSafeActionClient } from "next-safe-action";
import { deleteTeacherFormSchema } from "~/lib/validation/delete-teacher";
import { db } from "../db";
import { revalidatePath } from "next/cache";
import { validateRequest } from "~/lib/validate-request";
import { lucia } from "~/lib/auth";
import { cookies } from "next/headers";
import { redirect } from "next/navigation";
import {
  classrooms,
  file_upload,
  studentsInfo,
  teachersInfo,
  users,
} from "../db/schema";
import { eq } from "drizzle-orm";
import { minioClient } from "../minio/minio";

const action = createSafeActionClient();

export const deleteTeacherAction = action
  .schema(deleteTeacherFormSchema)
  .action(async ({ parsedInput: { userId } }) => {
    const { session, user } = await validateRequest();

    if (!session || !user) {
      return { error: "Unauthorized" };
    }

    const result = await db.transaction(async (tx) => {
      try {
        // teacher
        const teacher = await tx.query.teachersInfo.findFirst({
          where: eq(teachersInfo.userId, userId),
        });

        if (!teacher) {
          return {
            error: "Teacher not found.",
          };
        }

        // grab classroom of teacher
        const teacherClassrooms = await tx.query.classrooms.findMany({
          where: eq(classrooms.teacherId, teacher.id),
        });

        // skip if no classroom, so no students, classrooms, and file uploads
        if (teacherClassrooms.length > 0) {
          for (const teacherClassroom of teacherClassrooms) {
            // grab files metadata
            const files = await tx.query.file_upload.findMany({
              where: eq(file_upload.classroomId, teacherClassroom.id),
            });

            // erase from bucket and metadata
            for (const file of files) {
              if (file.bucket && file.fileName) {
                await Promise.all([
                  minioClient.removeObject(file.bucket, file.fileName),
                  tx.delete(file_upload).where(eq(file_upload.id, file.id)),
                ]);
              }
            }

            // grab students from a class
            const classroomStudents = await tx.query.studentsInfo.findMany({
              where: eq(studentsInfo.classroomId, teacherClassroom.id),
            });

            // delete their login and info
            if (classroomStudents.length > 0) {
              for (const student of classroomStudents) {
                await tx.delete(users).where(eq(users.id, student.userId));
              }
            }
          }
        }

        // delete their info
        await tx.delete(users).where(eq(users.id, teacher.userId));

        // Return a flag if the user is deleting themselves
        if (user.role === "teacher") {
          return {
            success: `Teacher deleted successfully.`,
            selfDeleted: true,
          };
        }

        return { success: `Teacher deleted successfully.`, selfDeleted: false };
      } catch (error) {
        console.log(error);
        tx.rollback();
        return { error: "Something went wrong. Please try again later." };
      }
    });

    if (result.error) {
      return { error: result.error };
    }

    // Handle post-transaction logic
    if (result.selfDeleted) {
      // Invalidate session
      await lucia.invalidateSession(session.id);

      // Create blank cookie
      const sessionCookie = lucia.createBlankSessionCookie();

      // Set the cookie
      cookies().set(
        sessionCookie.name,
        sessionCookie.value,
        sessionCookie.attributes,
      );

      redirect("/"); // Perform redirect here, after transaction
    }

    revalidatePath("/dashboard/admin");
    return { success: result.success };
  });
