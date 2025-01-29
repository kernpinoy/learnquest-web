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
      classroomId: studentsInfo.classroomId,
      fullName: studentFullName,
      firstName: studentsInfo.firstName,
      middleName: studentsInfo.middleName,
      lastName: studentsInfo.lastName,
      sex: studentsInfo.gender,
      archived: studentsInfo.archived,
      createdAt: studentsInfo.createdAt,
    })
    .from(studentsInfo)
    .innerJoin(users, eq(users.id, studentsInfo.userId))
    .where(eq(studentsInfo.classroomId, classroom.id))
    .orderBy(asc(studentsInfo.lastName));

  return students;
}

export async function getClassroomName(classCode: string) {
  const result = await db.query.classrooms.findFirst({
    where: eq(classrooms.classCode, classCode),
    columns: { name: true },
  });

  return result!.name;
}
