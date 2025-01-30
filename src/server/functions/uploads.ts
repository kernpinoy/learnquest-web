"use server";

import { eq } from "drizzle-orm";
import { db } from "../db";
import { classrooms, file_upload } from "../db/schema";

export async function getUploadedFiles(classCode: string) {
  const result = await db
    .select({
      id: file_upload.id,
      name: file_upload.originalName,
      size: file_upload.size,
      modified: file_upload.createdAt,
    })
    .from(file_upload)
    .innerJoin(classrooms, eq(file_upload.classroomId, classrooms.id))
    .where(eq(classrooms.classCode, classCode));

  return result;
}
