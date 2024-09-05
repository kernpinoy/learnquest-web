import { drizzle } from "drizzle-orm/postgres-js";
import postgres from "postgres";
import { migrate } from "drizzle-orm/postgres-js/migrator";
import env from "~/env";
import * as schema from "~/db/schema";

type PostgresType = Record<string, postgres.PostgresType>;

// function for creation connections
function createConnection<T extends PostgresType>(
  url: string,
  options?: postgres.Options<T>
) {
  return postgres(url, options);
}

const conn = createConnection(env.DATABASE_URL, { max: 1 });
const db = drizzle(conn, { schema });

async function main() {
  await migrate(db, { migrationsFolder: "./drizzle" });

  await conn.end();
}

main().catch((err) => {
  console.error(err);
  process.exit(1);
});
