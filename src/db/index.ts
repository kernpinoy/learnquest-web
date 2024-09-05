import { drizzle } from "drizzle-orm/postgres-js";
import postgres from "postgres";
import env from "~/env";
import * as schema from "./schema";

type PostgresType = Record<string, postgres.PostgresType>;

// Cache database connection for development
const globalForDb = globalThis as unknown as {
  conn: postgres.Sql | undefined;
};

// function for creation connections
function createConnection<T extends PostgresType>(
  url: string,
  options?: postgres.Options<T>
) {
  return postgres(url, options);
}

// Create or reuse connection
const conn = globalForDb.conn ?? createConnection(env.DATABASE_URL);

// Export database connection
export const db = drizzle(conn, { schema });
