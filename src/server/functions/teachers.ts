"use server";

import { asc, eq, and } from "drizzle-orm";
import { getSalt, hashPassword } from "~/lib/hash";
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

export async function getTeacherInfo(userId: string) {
  const [result] = await db
    .select({
      firstName: teachersInfo.firstName,
      middleName: teachersInfo.middleName,
      lastName: teachersInfo.lastName,
      userId: teachersInfo.userId,
    })
    .from(teachersInfo)
    .where(eq(teachersInfo.userId, userId));

  return result;
}

export async function updateTeacherInfo(
  firstName: string,
  middleName: string,
  lastName: string,
  userId: string,
) {
  const result = await db
    .update(teachersInfo)
    .set({ firstName, middleName, lastName })
    .where(eq(teachersInfo.userId, userId));

  return result;
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
      teacherId: teachersInfo.id,
    })
    .from(teachersInfo)
    .innerJoin(users, eq(users.id, teachersInfo.userId))
    .orderBy(asc(teachersInfo.createdAt))
    .where(eq(teachersInfo.archived, false));

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

export async function getTeacherClassroom(userId: string) {
  const result = await db
    .select({
      id: classrooms.id,
      name: classrooms.name,
      teacherId: classrooms.teacherId,
      createdAt: classrooms.createdAt,
      classSession: classrooms.classSession,
      classCode: classrooms.classCode,
      maxStudents: classrooms.maxStudents,
      schoolYear: classrooms.schoolYear,
    })
    .from(classrooms)
    .innerJoin(teachersInfo, eq(classrooms.teacherId, teachersInfo.id))
    .innerJoin(users, eq(users.id, teachersInfo.userId))
    .where(and(eq(users.id, userId), eq(classrooms.archived, false)));

  return result;
}

export async function deleteTeacher(userId: string) {
  const result = await db.delete(users).where(eq(users.id, userId));

  return result;
}

export async function archiveTeacher(teacherId: string) {
  const result = await db
    .update(teachersInfo)
    .set({ archived: true, archivedAt: new Date() })
    .where(eq(teachersInfo.id, teacherId))
    .returning();

  return result;
}

export async function unarchiveTeacher(teacherId: string) {
  const result = await db
    .update(teachersInfo)
    .set({ archived: false, archivedAt: null })
    .where(eq(teachersInfo.id, teacherId))
    .returning();

  return result;
}

export async function getArchiveTeachers() {
  const result = await db
    .select()
    .from(teachersInfo)
    .where(eq(teachersInfo.archived, true));

  return result;
}

export async function changeUsername(userId: string, newUsername: string) {
  const result = await db
    .update(users)
    .set({ username: newUsername })
    .where(eq(users.id, userId));

  return result;
}

export async function changePassword(userId: string, newPassword: string) {
  const salt = getSalt();
  const saltText = salt.toString("base64");
  const hashedPw = await hashPassword(newPassword, salt);

  const result = await db
    .update(users)
    .set({ hashedPassword: hashedPw, salt: saltText })
    .where(eq(users.id, userId));

  return result;
}
