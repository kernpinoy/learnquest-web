import { createEnv } from "@t3-oss/env-nextjs";
import { z } from "zod";

export const env = createEnv({
  server: {
    DATABASE_URL: z.string().url(),
    MIGRATION_DATABASE_URL: z.string().url(),
  },
  client: {},
  // If you're using Next.js < 13.4.4, you'll need to specify the runtimeEnv manually
  experimental__runtimeEnv: {},

  skipValidation: !!process.env.SKIP_VALIDATION,
  emptyStringAsUndefined: true,
});
