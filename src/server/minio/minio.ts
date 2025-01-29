import * as Minio from "minio";
import { env } from "~/env";

export const minioClient = new Minio.Client({
  endPoint: "localhost",
  port: 9000,
  useSSL: false,
  accessKey: env.MINIO_ACCESS_KEY,
  secretKey: env.MINIO_SECRET_KEY,
  region: env.MINIO_LOCATION,
});
