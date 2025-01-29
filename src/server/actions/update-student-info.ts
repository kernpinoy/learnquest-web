"use server";

import { createSafeActionClient } from "next-safe-action";
import { validateRequest } from "~/lib/validate-request";
import { updateStudentFormSchema } from "~/lib/validation/update-student-info";
import { db } from "../db";
import { eq } from "drizzle-orm";
import { studentsInfo, users } from "../db/schema";
import { revalidatePath } from "next/cache";

const action = createSafeActionClient();

export const updateStudentInfoAction = action
  .schema(updateStudentFormSchema)
  .action(
    async ({ parsedInput: { firstName, lastName, lrn, middleName, sex } }) => {
      const { session, user } = await validateRequest();

      if (!session || !user) {
        return {
          error: "Not allowed to do the operation.",
        };
      }

      const result = await db.transaction(async (tx) => {
        try {
          const user = await tx.query.users.findFirst({
            where: eq(users.username, lrn),
          });

          if (!user) {
            return {
              error: "User not found.",
            };
          }

          await tx
            .update(studentsInfo)
            .set({
              firstName,
              lastName,
              middleName,
              gender: sex,
            })
            .where(eq(studentsInfo.userId, user.id));

          return {
            success: "Changed details of student successfully.",
          };
        } catch (e) {
          console.error(e);
          tx.rollback();
          return {
            error: "Something went wrong. Please try later.",
          };
        }
      });

      if (result.error) {
        return {
          error: result.error,
        };
      }

      if (user.role === "admin") {
        revalidatePath("/dashboard/admin/[username]/[classCode]", "page");
      } else {
        revalidatePath("/dashboard/teacher/[classCode]", "page");
      }

      return {
        success: result.success,
      };
    },
  );
