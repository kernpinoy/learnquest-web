import { pgEnum, pgTable, text, timestamp } from "drizzle-orm/pg-core";

// Use enums for roles
export const roleEnum = pgEnum("role", ["admin", "teacher"]);

export const usersTable = pgTable("users", {
  id: text("id").primaryKey(),
  userName: text("username").notNull().unique(),
  hashedPassword: text("hashed_password").notNull(),
  role: roleEnum("role").notNull().default("teacher"),
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
