"use server";

import { createSafeActionClient } from "next-safe-action";
import { changeUsernameFormSchema } from "~/lib/validation/change-teacher-username";
import { changeUsername } from "../functions/teachers";
import { db } from "../db";
import { QueryClient } from "@tanstack/react-query";

const action = createSafeActionClient();

export const changeUsernameAction = action
  .schema(changeUsernameFormSchema)
  .action(async ({ parsedInput: { userId, username, confirmUsername } }) => {
    if (username !== confirmUsername) {
      return { error: "Usernames does not match." };
    }

    // Create new user and teacher account
    const result = await db.transaction(async (tx) => {
      try {
        await changeUsername(userId, username);

        // Invalidate relevant queries
        const queryClient = new QueryClient();
        await queryClient.invalidateQueries({
          queryKey: ["teacher-classroom", userId]
        });

        return { success: `Username changed successfully.` };
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