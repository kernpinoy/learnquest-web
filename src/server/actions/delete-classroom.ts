"use server";

import { createSafeActionClient } from "next-safe-action";
import { db } from "../db";
import { revalidatePath } from "next/cache";
import { validateRequest } from "~/lib/validate-request";
import {
  classrooms,
  file_upload,
  studentsInfo,
  teachersInfo,
  users,
} from "../db/schema";
import { eq } from "drizzle-orm";
import { minioClient } from "../minio/minio";
import { deleteClassroomSchema } from "~/lib/validation/delete-classroom";

const action = createSafeActionClient();

export const deleteClassroomAction = action
  .schema(deleteClassroomSchema)
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

        // check for files
        const files = await tx.query.file_upload.findMany({
          where: eq(file_upload.userId, teacher.userId),
        });

        // delete files if exists
        if (files.length > 0) {
          for (const file of files) {
            await minioClient.removeObject(file.bucket!, file.fileName!);
            await tx
              .delete(file_upload)
              .where(eq(file_upload.userId, teacher.userId));
          }
        }

        // grab studs
        const students = await tx.query.studentsInfo.findMany({
          where: eq(studentsInfo.classroomId, classroom.id),
        });

        // delete all studs if they have
        if (students.length > 0) {
          for (const student of students) {
            await tx.delete(users).where(eq(users.id, student.userId));
          }
        }

        // delete classroom finally
        await tx.delete(classrooms).where(eq(classrooms.id, classroom.id));

        return {
          success: "Classroom deleted successfully.",
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
