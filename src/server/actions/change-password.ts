"use server";

import { createSafeActionClient } from "next-safe-action";
import { resetAccountFormSchema } from "~/lib/validation/reset-account";
import { changePassword } from "../functions/teachers";
import { db } from "../db";

const action = createSafeActionClient();

export const resetPassword = action
  .schema(resetAccountFormSchema)
  .action(async ({ parsedInput: { userId, password, confirmPassword } }) => {
    if (confirmPassword !== password) {
      return { error: "Passwords does not match." };
    }

    // Create new user and teacher account
    const result = await db.transaction(async (tx) => {
      try {
        const hehe = await changePassword(userId, password);
        
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
