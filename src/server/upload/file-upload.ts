"use server";

import { validateRequest } from "~/lib/validate-request";
import { minioClient } from "../minio/minio";
import { env } from "~/env";
import crypto from "crypto";
import { db } from "../db";
import { eq } from "drizzle-orm";
import { classrooms, file_upload, teachersInfo } from "../db/schema";
import { revalidatePath } from "next/cache";

const accepted = ["application/pdf"];
const maxSize = 1024 * 1024 * 10; //10mb
const generateFileName = (bytes = 32) =>
  crypto.randomBytes(bytes).toString("hex");

export async function getSignedUrl(
  fileType: string,
  size: number,
  fileName: string,
  classCode: string,
) {
  const { session, user } = await validateRequest();

  if (!session || !user) {
    return {
      failure: "User not authenticated.",
    };
  }

  if (user.role === "student") {
    return {
      failure: "User role not authorized.",
    };
  }

  if (!accepted.includes(fileType)) {
    return {
      failure: "File type not allowed.",
    };
  }

  if (size > maxSize) {
    return {
      failure: "File size too large.",
    };
  }

  const randoName = generateFileName();
  const putObject = await minioClient.presignedPutObject(
    env.MINIO_BUCKET,
    randoName,
    24 * 60 * 60,
  );

  const classroom = await db.query.classrooms.findFirst({
    where: eq(classrooms.classCode, classCode),
  });

  if (!classroom) {
    return {
      failure: "Classroom not found.",
    };
  }

  const teacher = await db.query.teachersInfo.findFirst({
    where: eq(teachersInfo.id, classroom.teacherId),
  });

  if (!teacher) {
    return {
      failure: "Teacher not found.",
    };
  }

  const result = await db.transaction(async (tx) => {
    try {
      await tx.insert(file_upload).values({
        userId: teacher.userId,
        classroomId: classroom.id,
        bucket: "learnquest-storage",
        fileName: randoName,
        originalName: fileName,
        size: size,
        fileType: fileType,
      });

      return {
        done: true,
      };
    } catch {
      tx.rollback();

      return {
        done: false,
      };
    }
  });

  if (result?.done === false) {
    return {
      failure: "Unable to record upload to DB. Try again.",
    };
  }

  revalidatePath("/dashboard/teacher/[classCode]", "page");

  return {
    success: {
      url: putObject,
    },
  };
}
