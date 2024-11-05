"use server";

import { createSafeActionClient } from "next-safe-action";
import { type LoginForm, loginFormSchema } from "~/lib/validation/login";
import { hash, verify } from "@node-rs/argon2";
import { cookies } from "next/headers";
import { lucia } from "~/lib/auth";
import { db } from "~/server/db";
import { eq } from "drizzle-orm";
import { users } from "~/server/db/schema";
import { redirect } from "next/navigation";

const loginAction = createSafeActionClient();

export const loginAccountAction = loginAction
  .schema(loginFormSchema) // Apply your form schema for validation
  .action(async ({ parsedInput: { username, password } }) => {
    try {
      // Check if the user exists
      const existingUser = await db.query.users.findFirst({
        where: eq(users.username, username),
      });

      // Handle non-existent user
      if (!existingUser) {
        // Hash invalid password to mitigate brute force attacks
        await hash(password, {
          memoryCost: 19456,
          timeCost: 2,
          outputLen: 32,
          parallelism: 1,
        });

        return { error: "User does not exist." };
      }

      // Verify the password
      const validPassword = await verify(
        existingUser.hashedPassword,
        password,
        {
          salt: Buffer.from(existingUser.salt),
          memoryCost: 19456,
          timeCost: 2,
          outputLen: 32,
          parallelism: 1,
        }
      );

      // Handle invalid password
      if (!validPassword) {
        return { error: "Invalid username or password. Try again." };
      }

      // Create session if login is successful
      const session = await lucia.createSession(existingUser.id, {});
      const sessionCookie = lucia.createSessionCookie(session.id);

      // Set the session cookie
      (await cookies()).set(
        sessionCookie.name,
        sessionCookie.value,
        sessionCookie.attributes
      );

      return {
        success: "Logged in successfully.",
        redirectTo: `${existingUser.role}`,
      };
    } catch (error) {
      return { error: "Something went wrong. Please try again later." };
    }
  });
