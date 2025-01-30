"use server";

import { createSafeActionClient } from "next-safe-action";
import { resetAccountFormSchema } from "~/lib/validation/reset-account";
import { changePassword } from "../functions/teachers";
import { db } from "../db";
import { validateRequest } from "~/lib/validate-request";
import { getSalt, hashPassword } from "~/lib/hash";
import { users } from "../db/schema";
import { eq } from "drizzle-orm";

const action = createSafeActionClient();

export const resetPassword = action
  .schema(resetAccountFormSchema)
  .action(async ({ parsedInput: { userId, password, confirmPassword } }) => {
    const { session, user } = await validateRequest();

    if (!session || !user) {
      return {
        error: "Unauthenticated.",
      };
    }

    if (confirmPassword !== password) {
      return { error: "Passwords does not match." };
    }

    // Create new user and teacher account
    const result = await db.transaction(async (tx) => {
      try {
        const user = await tx.query.users.findFirst({
          where: eq(users.id, userId),
        });

        if (!user) {
          return {
            error: "User not found.",
          };
        }

        const salt = getSalt();
        const saltText = salt.toString("base64");
        const hashedPw = await hashPassword(password, salt);

        await tx
          .update(users)
          .set({ hashedPassword: hashedPw, salt: saltText })
          .where(eq(users.id, user.id));

        return { success: `Password changed successfully.` };
      } catch (error) {
        tx.rollback();
        return { error: "Something went wrong. Please try again later." };
      }
    });

    if (result.error) {
      return { error: result.error };
    }

    return { success: result.success };
  });
