import { pgTable, integer, text } from "drizzle-orm/pg-core";

export const postsTable = pgTable("posts", {
  id: integer("id").primaryKey().generatedAlwaysAsIdentity({ startWith: 1 }),
  author: text("author"),
  post: text("post"),
});
