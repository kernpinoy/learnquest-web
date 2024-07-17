"use server";

import { LoginFormSchemaType } from "~/lib/forms/login-form";
import { hash, verify } from "@node-rs/argon2";
import { cookies } from "next/headers";
import { lucia } from "~/lib/auth";
import { db } from "~/db";
import { eq } from "drizzle-orm";
import { usersTable } from "~/db/schema";

interface ActionResult {
  type: "success" | "invalid" | "error";
  redirectTo?: string;
  message: string;
}

export async function loginAccountAction(
  values: LoginFormSchemaType
): Promise<ActionResult> {
  const { username, password } = values;

  // Check if username do exist
  // TODO: Move all drizzle calls to separate files ala data layer
  const existingUser = await db.query.usersTable.findFirst({
    where: eq(usersTable.userName, username),
  });

  // Reject non-registered user
  if (!existingUser) {
    // Hash invalid password to introduce variation to wait times, lessening bruteforce
    // FIXME: Ratelimit or login throttle them
    await hash(password, {
      // recommended minimum parameters
      memoryCost: 19456,
      timeCost: 2,
      outputLen: 32,
      parallelism: 1,
    });

    return {
      type: "error",
      message: "User does not exist.",
    };
  }

  // Check for invalid password
  const validPassword = await verify(
    existingUser?.hashedPassword as string | Buffer,
    password,
    {
      memoryCost: 19456,
      timeCost: 2,
      outputLen: 32,
      parallelism: 1,
    }
  );

  // show invalid password
  if (!validPassword) {
    return {
      type: "invalid",
      message: "Invalid username or password. Try again.",
    };
  }

  const session = await lucia.createSession(existingUser.id, {});
  const sessionCookie = lucia.createSessionCookie(session.id);
  cookies().set(
    sessionCookie.name,
    sessionCookie.value,
    sessionCookie.attributes
  );

  return {
    type: "success",
    message: "Login successful.",
    redirectTo: existingUser.role,
  };
}
