import "server-only";
import { eq } from "drizzle-orm";
import { db } from "~/server/db";
import { users } from "~/server/db/schema";

export async function getUser(username: string) {
  const [user] = await db
    .select({
      username: users.username,
    })
    .from(users)
    .where(eq(users.username, username));

  if (!user) return null;

  return user;
}
