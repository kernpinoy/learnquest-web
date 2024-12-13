"use server";
import { createSafeActionClient } from "next-safe-action";
import { addStudentFormSchema } from "~/lib/validation/add-student";
import { validateRequest } from "~/lib/validate-request";
import { db } from "../db";
import { classrooms, studentsInfo, users } from "../db/schema";
import { getSalt, hashPassword } from "~/lib/hash";
import { eq } from "drizzle-orm";
import { revalidatePath } from "next/cache";
import { env } from "~/env";

const action = createSafeActionClient();

export const createStudentAction = action
  .schema(addStudentFormSchema)
  .action(
    async ({
      parsedInput: {
        classCode,
        firstName,
        lastName,
        lrn,
        middleName,
        password,
        sex,
      },
    }) => {
      const { session, user } = await validateRequest();

      if (!session || !user) {
        return {
          error: "Not allowed to do the operation.",
        };
      }

      // transact with the db lmao
      const result = await db.transaction(async (tx) => {
        try {
          // check if lrn is duplicate
          console.log(lrn);
          const [duplicateLrn] = await tx
            .select({
              lrn: users.username,
            })
            .from(users)
            .where(eq(users.username, lrn));

          if (duplicateLrn && duplicateLrn.lrn === lrn) {
            return {
              error: "LRN is already registered. Duplicates are not allowed.",
            };
          }

          // grab classroom id from classcode
          const [classroom] = await tx
            .select({ id: classrooms.id })
            .from(classrooms)
            .where(eq(classrooms.classCode, classCode));

          // hash and salt password lmfao
          const salt = getSalt();
          const saltText = salt.toString("base64");
          const hashedPassword = await hashPassword(password, salt);

          // insert login info first to the db
          const [newUser] = await tx
            .insert(users)
            .values({
              role: "student",
              username: lrn,
              hashedPassword: hashedPassword,
              salt: saltText,
            })
            .returning({ id: users.id });

          // insert to student info
          await tx.insert(studentsInfo).values({
            classroomId: classroom.id,
            firstName: firstName,
            middleName: middleName,
            lastName: lastName,
            gender: sex,
            userId: newUser.id,
          });

          return {
            success: "Student successfully added.",
          };
        } catch (error) {
          console.error(error);
          tx.rollback();
          return {
            error: "Something went wrong. Please try again.",
          };
        }
      });

      if (result.error) {
        return {
          error: result.error,
        };
      }

      // revalidate path
      revalidatePath("/dashboard/teacher/[classCode]", "page");
      return { success: result.success };
    },
  );
