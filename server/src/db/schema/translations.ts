import { int, sqliteTable, text } from "drizzle-orm/sqlite-core";

export const translationsTable = sqliteTable("translations", {
  id: int("id").primaryKey({ autoIncrement: true }),
  locale: text().notNull().$type<"en-US" | "tr-TR">(),
  key: text().notNull(),
  text: text().notNull(),
});
