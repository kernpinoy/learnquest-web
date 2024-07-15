import { defineConfig } from "drizzle-kit";
import { env } from "~/env";

export default defineConfig({
  schema: "./db/schema.ts",
  out: "./supabase/migrations",
  dialect: "postgresql",
  dbCredentials: {
    url: env.MIGRATION_DATABASE_URL,
    ssl: true,
  },
  migrations: {
    prefix: "supabase",
  },
});
