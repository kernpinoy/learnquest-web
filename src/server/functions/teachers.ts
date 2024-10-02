"use server";

import { asc, eq } from "drizzle-orm";
import { db } from "~/server/db";
import {
  classrooms,
  classSession,
  teachersInfo,
  users,
} from "~/server/db/schema";
import { teacherFullName } from "~/server/db/sql-commands";

export async function getAllClassById(id: string) {
  const allClass = await db
    .select({
      name: classrooms.name,
      classCode: classrooms.classCode,
      classSession: classrooms.classSession,
      createdAt: classrooms.createdAt,
      id: classrooms.id,
    })
    .from(classrooms)
    .innerJoin(users, eq(classrooms.teacherId, id));

  return allClass;
}

export async function getAllTeacherUsername() {
  const allTeacherUsername = await db
    .select({ username: users.username })
    .from(users)
    .innerJoin(teachersInfo, eq(users.id, teachersInfo.userId));

  return allTeacherUsername;
}

export async function getAllClassCode() {
  const result = await db
    .select({ classCode: classrooms.classCode })
    .from(classrooms);

  return result;
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

export async function getTeacherClassroom(username: string) {
  const result = await db
    .select({
      id: classrooms.id,
      name: classrooms.name,
      teacherId: classrooms.teacherId,
      createdAt: classrooms.createdAt,
      classSession: classrooms.classSession,
      classCode: classrooms.classCode,
    })
    .from(classrooms)
    .innerJoin(teachersInfo, eq(classrooms.teacherId, teachersInfo.id))
    .innerJoin(users, eq(users.id, teachersInfo.userId))
    .where(eq(users.username, username));

  return result;
}
