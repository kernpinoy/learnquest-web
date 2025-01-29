import { eq } from "drizzle-orm";
import { NextRequest, NextResponse } from "next/server";
import { validateRequest } from "~/lib/validate-request";
import { db } from "~/server/db";
import { file_upload } from "~/server/db/schema";
import { minioClient } from "~/server/minio/minio";

export async function GET(request: NextRequest) {
  const { session, user } = await validateRequest();

  if (!session || !user) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  if (!(user.role === "teacher" || user.role === "admin")) {
    return NextResponse.json({ error: "Forbidden" }, { status: 403 });
  }

  const searchParams = request.nextUrl.searchParams;
  const fileName = searchParams.get("file");

  if (!fileName) {
    return NextResponse.json(
      { error: "File name is required." },
      { status: 400 },
    );
  }

  const file = await db.query.file_upload.findFirst({
    where: eq(file_upload.originalName, fileName),
  });

  if (!file) {
    return NextResponse.json(
      { error: "File does not exist." },
      { status: 404 },
    );
  }

  try {
    const preSigned = await minioClient.presignedGetObject(
      file.bucket!,
      file.fileName!,
      24 * 60 * 60, // Expires in 1 day
      {
        "response-content-disposition": `attachment; filename="${file.originalName}"`,
        "response-content-type": `${file.fileType}`,
        "response-cache-control": "no-cache", // Disable caching
      },
    );

    return NextResponse.json({ url: preSigned }, { status: 200 });
  } catch {
    return NextResponse.json(
      { error: "Failed to generate download link. Try again." },
      { status: 500 },
    );
  }
}
