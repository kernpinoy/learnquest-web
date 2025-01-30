import { sql } from "drizzle-orm";
import { teachersInfo, studentsInfo, studentRegistrations } from "./schema";

export const teacherFullName = sql<string>`CONCAT(
        ${teachersInfo.firstName},
        ' ',
        COALESCE(LEFT(${teachersInfo.middleName}, 1), ''),
        '. ',
        ${teachersInfo.lastName}
      )`;

export const studentFullName = sql<string>`CONCAT(
  ${studentsInfo.firstName},
  ' ',
  COALESCE(LEFT(${studentsInfo.middleName}, 1), ''),
  '. ',
  ${studentsInfo.lastName}
  )`;

export const studentRegistrationFullName = sql<string>`CONCAT(
    ${studentRegistrations.firstName},
    ' ',
    COALESCE(LEFT(${studentRegistrations.middleName}, 1), ''),
    '. ',
    ${studentRegistrations.lastName}
  )`;
