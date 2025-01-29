"use server";

import { validateRequest } from "~/lib/validate-request";
import { db } from "../db";
import { eq } from "drizzle-orm";
import { file_upload } from "../db/schema";
import { minioClient } from "../minio/minio";
import { revalidatePath } from "next/cache";

export async function deleteUpload(fileId: string) {
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

  // Grab file metadata from the database
  const file = await db.query.file_upload.findFirst({
    where: eq(file_upload.id, fileId),
  });

  if (!file) {
    return {
      failure: "File not found in the database.",
    };
  }

  try {
    // Check if the file exists in MinIO storage
    const fileObject = await minioClient.statObject(
      file.bucket!,
      file.fileName!,
    );

    // If it exists, proceed with deletion
    await minioClient.removeObject(file.bucket!, file.fileName!);
    await db.delete(file_upload).where(eq(file_upload.id, fileId));

    revalidatePath(`/dashboard/teacher/[classCode]`);
    return {
      success: "File successfully deleted.",
    };
  } catch (error: any) {
    // Handle case where file is not found in storage
    if (error.code === "NoSuchKey") {
      return {
        failure: "File not found in storage.",
      };
    }

    // Log and rethrow any other error
    console.error("Error deleting file:", error);
    return {
      failure: "An error occurred while deleting the file.",
    };
  }
}
