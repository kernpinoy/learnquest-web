"use server";

import { createSafeActionClient } from "next-safe-action";
import { updateTeacherInfoSchema } from "~/lib/validation/update-teacher-info";
import { revalidatePath } from "next/cache";
import { db } from "../db";
import { validateRequest } from "~/lib/validate-request";
import { teachersInfo, users } from "../db/schema";
import { eq } from "drizzle-orm";

const action = createSafeActionClient();

export const updateTeacherInfo = action
  .schema(updateTeacherInfoSchema)
  .action(
    async ({ parsedInput: { firstName, middleName, lastName, userId } }) => {
      const { session, user } = await validateRequest();

      if (
        !session ||
        !user ||
        !(user.role === "admin" || user.role === "teacher")
      ) {
        return { error: "Unauthorized" };
      }

      const result = await db.transaction(async (tx) => {
        try {
          console.log(firstName, middleName, lastName);

          const existingUser = await db.query.users.findFirst({
            where: eq(users.id, userId),
          });

          if (!existingUser) {
            return {
              error: "User does not exist.",
            };
          }

          await db
            .update(teachersInfo)
            .set({
              firstName: firstName,
              middleName: middleName,
              lastName: lastName,
            })
            .where(eq(teachersInfo.userId, existingUser.id));

          console.log("Dito ka tumingin.");
          console.log(
            await db
              .select()
              .from(teachersInfo)
              .where(eq(teachersInfo.id, userId)),
          );

          return { success: "Personal information updated successfully." };
        } catch (error) {
          tx.rollback();
          return { error: "Failed to update personal information." };
        }
      });

      if (result.error) {
        return { error: result.error };
      }

      if (user.role === "teacher") {
        revalidatePath("/dashboard/teacher/settings");
      } else {
        revalidatePath("/dashboard/admin/[username]");
      }

      return { success: result.success };
    },
  );
