import { int, sqliteTable, text } from "drizzle-orm/sqlite-core";
import { relations } from "drizzle-orm";
import { companiesTable } from "./companies";

export const modelsTable = sqliteTable("models", {
  id: int("id").primaryKey({ autoIncrement: true }),
  name: text("name").notNull(),
  companyId: int("company_id")
    .notNull()
    .references(() => companiesTable.id),
  maxTradeValue: int("max_trade_value").notNull(),
  imageUrl: text("image_url"),
});

export const modelsRelations = relations(modelsTable, ({ one }) => ({
  company: one(companiesTable, {
    fields: [modelsTable.companyId],
    references: [companiesTable.id],
  }),
}));
