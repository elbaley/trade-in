import { sqliteTable, text, integer } from "drizzle-orm/sqlite-core";

export const sessionsTable = sqliteTable("sessions", {
  id: text("id").notNull().primaryKey(),
  userId: text("user_id").notNull(),
  expiresAt: integer("expires_at").notNull(),
});
