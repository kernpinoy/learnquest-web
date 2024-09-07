import { sql } from "drizzle-orm";
import { teachersInfo } from "./schema";

export const teacherFullName = sql<string>`CONCAT(
        ${teachersInfo.firstName},
        ' ',
        COALESCE(LEFT(${teachersInfo.middleName}, 1), ''),
        '. ',
        ${teachersInfo.lastName}
      )`;
