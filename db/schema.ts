import { pgEnum, pgTable, text, timestamp, integer } from "drizzle-orm/pg-core";

// Use enums for roles
export const roleEnum = pgEnum("role", ["admin", "teacher"]);

export const usersTable = pgTable("users", {
  id: text("id").primaryKey(),
  userName: text("username").notNull().unique(),
  salt: text("salt").notNull().unique(),
  hashedPassword: text("hashed_password").notNull(),
  role: roleEnum("role").notNull().default("teacher"),
});

export const teachersInfoTable = pgTable("teachers_info", {
  id: integer("id").primaryKey().generatedAlwaysAsIdentity({ startWith: 1 }),
  firstName: text("first_name").notNull(),
  middleName: text("middle_name").notNull(),
  lastName: text("last_name").notNull(),
  userId: text("user_id")
    .notNull()
    .references(() => usersTable.id, { onDelete: "cascade" }),
  createdAt: timestamp("created_at", {
    withTimezone: true,
    mode: "date",
  })
    .notNull()
    .defaultNow(),
});

export const sessionTable = pgTable("session", {
  id: text("id").primaryKey(),
  userId: text("user_id")
    .notNull()
    .references(() => usersTable.id, { onDelete: "cascade" }),
  expiresAt: timestamp("expires_at", {
    withTimezone: true,
    mode: "date",
  }).notNull(),
});
