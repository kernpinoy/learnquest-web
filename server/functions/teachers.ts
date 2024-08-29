"use server";

import { asc, eq } from "drizzle-orm";
import { db } from "~/server/db";
import { teachersInfo, users } from "~/server/db/schema";
import { teacherFullName } from "~/server/db/sql-commands";

export async function getAllTeacherUsername() {
  const allTeacherUsername = await db
    .select({ username: users.username })
    .from(users)
    .innerJoin(teachersInfo, eq(users.id, teachersInfo.userId));

  return allTeacherUsername;
}

export async function getTeacherDetails() {
  const result = await db
    .select({
      fullName: teacherFullName,
      createdAt: teachersInfo.createdAt,
      username: users.username,
      id: users.id,
    })
    .from(teachersInfo)
    .innerJoin(users, eq(users.id, teachersInfo.userId))
    .orderBy(asc(teachersInfo.createdAt));

  return result;
}

export async function getTeacherFullName(username: string) {
  const [result] = await db
    .select({
      fullname: teacherFullName,
    })
    .from(teachersInfo)
    .innerJoin(users, eq(users.id, teachersInfo.userId))
    .where(eq(users.username, username));

  return result.fullname;
}
