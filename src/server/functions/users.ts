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

export async function getUserId(username: string) {
  const [user] = await db
    .select({
      id: users.id,
    })
    .from(users)
    .where(eq(users.username, username));

  if (!user) return null;

  return user.id;
}


export async function updateUserInfo(
  userId: string,
  username: string,
  password: string,
  salt: string
) {
  const [user] = await db
    .update(users)
    .set({ username, hashedPassword: password, salt })
    .where(eq(users.id, userId));

  return user;
}
