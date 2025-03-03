import { int, sqliteTable, text } from "drizzle-orm/sqlite-core";
import { modelsTable } from "./models";
import { relations } from "drizzle-orm";

export const companiesTable = sqliteTable("companies", {
  id: int("id").primaryKey({ autoIncrement: true }),
  name: text("name").notNull().unique(),
  logoUrl: text("logo_url"),
});

export const companiesRelations = relations(companiesTable, ({ many }) => ({
  models: many(modelsTable),
}));
