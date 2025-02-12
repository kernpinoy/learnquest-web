import * as Minio from "minio";
import { env } from "~/env";

export const minioClient = new Minio.Client({
  endPoint: env.MINIO_ENDPOINT,
  useSSL: env.NODE_ENV === "production",
  accessKey: env.MINIO_ACCESS_KEY,
  secretKey: env.MINIO_SECRET_KEY,
  region: env.MINIO_LOCATION,
  port:
    env.NODE_ENV === "development" ? Number(process.env.MINIO_PORT) : undefined,
});
