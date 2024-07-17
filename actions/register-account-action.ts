"use server";

import { db } from "~/db/";
import { hash } from "@node-rs/argon2";
import { cookies } from "next/headers";
import { lucia } from "~/lib/auth";
import { generateIdFromEntropySize } from "lucia";
import { RegisterFormSchemaType } from "~/lib/forms/register-form";
import { randomBytes } from "crypto";
import { eq } from "drizzle-orm";
import { usersTable, teachersInfoTable } from "~/db/schema";
import { redirect } from "next/navigation";

export default async function registerAccountAction({
  firstName,
  middleName,
  lastName,
  username,
  password,
  confirmPassword,
}: RegisterFormSchemaType) {
  const passwordSalt = randomBytes(16);
  const passwordHash = await hash(password, {
    // Minimum requirments for hashing password
    salt: passwordSalt,
    memoryCost: 19456,
    timeCost: 2,
    outputLen: 32,
    parallelism: 1,
  });

  // generate user id
  const userId = generateIdFromEntropySize(16);

  // Check if username already exist
  const existingUser = await db.query.usersTable.findFirst({
    where: eq(usersTable.userName, username),
  });

  if (existingUser) {
    return {
      type: "error",
      message: "Username already taken. Choose another username",
    };
  }

  // Insert to user and detail
  const insertCredentials = db.insert(usersTable).values({
    id: userId,
    userName: username,
    hashedPassword: passwordHash,
    salt: passwordSalt.toString(),
    role: "teacher",
  });

  const insertTeacherDetails = db.insert(teachersInfoTable).values({
    firstName: firstName,
    middleName: middleName,
    lastName: lastName,
    userId: userId,
  });

  await Promise.all([insertCredentials, insertTeacherDetails]);

  const session = await lucia.createSession(userId, {});
  const sessionCookie = lucia.createSessionCookie(session.id);
  cookies().set(
    sessionCookie.name,
    sessionCookie.value,
    sessionCookie.attributes
  );
  return redirect("/admin");
}
