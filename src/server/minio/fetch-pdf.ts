"use server";

import { minioClient } from "./minio";

export async function fetchAllPdfs() {
  const bucketName = "learnquest-storage"; // Replace with your bucket name
  const prefix = ""; // Use an empty prefix to list all objects
  const pdfs: {
    name: string;
    size: number;
    modified: Date;
    downloadLink: string;
  }[] = [];

  return new Promise((resolve, reject) => {
    // List objects in the bucket
    const stream = minioClient.listObjectsV2(bucketName, prefix, true);
    let pendingPromises = 0;

    stream.on("data", async (obj) => {
      if (obj.name && obj.name.endsWith(".pdf")) {
        pendingPromises++;
        try {
          const presignedUrl = await minioClient.presignedGetObject(
            bucketName,
            obj.name,
            60 * 60 * 24 * 7, // Presigned URL valid for 7 days
          );

          pdfs.push({
            name: obj.name,
            size: obj.size,
            modified: obj.lastModified,
            downloadLink: presignedUrl,
          });

          console.log(`Processed PDF: ${obj.name}`);
        } catch (err) {
          console.error(`Error processing PDF ${obj.name}:`, err);
        } finally {
          pendingPromises--;
          if (pendingPromises === 0) {
            stream.destroy(); // Ensure the stream is closed
          }
        }
      }
    });

    stream.on("error", (err) => {
      console.error("Error listing objects:", err);
      reject(err);
    });

    stream.on("end", () => {
      if (pendingPromises === 0) {
        console.log("Finished listing objects.");
        resolve(pdfs);
      }
    });
  });
}
