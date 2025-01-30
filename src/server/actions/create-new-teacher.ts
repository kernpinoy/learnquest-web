"use server";
import { createSafeActionClient } from "next-safe-action";
import { addTeacherFormSchema } from "~/lib/validation/add-teacher";
import { getUser } from "../functions/users";
import { getSalt, hashPassword } from "~/lib/hash";
import { db } from "~/server/db";
import { teachersInfo, users } from "../db/schema";
import { revalidatePath } from "next/cache";

const action = createSafeActionClient();

export const createTeacher = action
  .schema(addTeacherFormSchema)
  .action(
    async ({
      parsedInput: { firstName, middleName, lastName, username, password },
    }) => {
      // Check first for duplicate username
      const existingUser = await getUser(username);

      if (existingUser) {
        return { error: "Username already exist. Choose another username." };
      }

      // Get salt for password
      const salt = getSalt();
      const saltText = salt.toString("base64");

      // Hash password
      const hashedPw = await hashPassword(password, salt);

      // Create new user and teacher account
      const result = await db.transaction(async (tx) => {
        try {
          const [newUser] = await tx
            .insert(users)
            .values({
              username,
              hashedPassword: hashedPw,
              salt: saltText,
            })
            .returning({
              userId: users.id,
            });

          await tx.insert(teachersInfo).values({
            firstName,
            middleName,
            lastName,
            userId: newUser.userId,
          });

          return { success: "Teacher account created successfully." };
        } catch (error) {
          tx.rollback();
          return { error: "Something went wrong. Please try again." };
        }
      });

      if (result.error) {
        return { error: result.error };
      }

      // Revalidate path
      console.log(firstName, middleName, lastName, username, password);
      revalidatePath("/dashboard/admin");
      return { success: result.success };
    },
  );
