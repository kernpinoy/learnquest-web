import { pgEnum, pgTable, text, timestamp } from "drizzle-orm/pg-core";

// Use enums for roles
export const userRole = pgEnum("role", ["admin", "teacher"]);

export const users = pgTable("users", {
  id: text("id")
    .primaryKey()
    .$defaultFn(() => crypto.randomUUID()),
  username: text("username").notNull().unique(),
  hashedPassword: text("hashed_password").notNull(),
  salt: text("salt").notNull().unique(),
  role: userRole("role").notNull().default("teacher"),
});

export const teachersInfo = pgTable("teachers_info", {
  id: text("id")
    .primaryKey()
    .$defaultFn(() => crypto.randomUUID()),
  firstName: text("first_name").notNull(),
  middleName: text("middle_name").notNull(),
  lastName: text("last_name").notNull(),
  userId: text("user_id")
    .notNull()
    .references(() => users.id, { onDelete: "cascade" }),
  createdAt: timestamp("created_at", {
    withTimezone: true,
    mode: "date",
  })
    .notNull()
    .defaultNow(),
});

export const sessions = pgTable("sessions", {
  id: text("id").primaryKey(),
  userId: text("user_id")
    .notNull()
    .references(() => users.id, { onDelete: "cascade" }),
  expiresAt: timestamp("expires_at", {
    withTimezone: true,
    mode: "date",
  }).notNull(),
});
