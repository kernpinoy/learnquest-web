"use server";

import { db } from "../db";
import { classrooms, studentsInfo, users } from "../db/schema";
import { asc, eq } from "drizzle-orm";
import { studentFullName } from "../db/sql-commands";

export async function getClassroomStudents(classCode: string) {
  // grab first the classroom id via checking class code
  const [classroom] = await db
    .select({
      id: classrooms.id,
    })
    .from(classrooms)
    .where(eq(classrooms.classCode, classCode));

  // filter the students_info table via the classroom id
  const students = await db
    .select({
      id: studentsInfo.id,
      lrn: users.username,
      fullName: studentFullName,
      sex: studentsInfo.gender,
      createdAt: studentsInfo.createdAt,
    })
    .from(studentsInfo)
    .innerJoin(users, eq(users.id, studentsInfo.userId))
    .where(eq(studentsInfo.classroomId, classroom.id))
    .orderBy(asc(studentsInfo.lastName));

  return students;
}
