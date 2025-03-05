import { sql } from "drizzle-orm";
import { integer, sqliteTable, text } from "drizzle-orm/sqlite-core";

export const tradeOffersTable = sqliteTable("trade_offers", {
  id: integer("id").primaryKey({ autoIncrement: true }),
  modelId: integer("model_id").notNull(),
  selections: text("selections").notNull(),
  offerPrice: integer("offer_price").notNull(),
  firstName: text("first_name"),
  lastName: text("last_name"),
  email: text("email"),
  phoneNumber: text("phone_number"),
  status: text("status")
    .default("pending")
    .notNull()
    .$type<"pending" | "accepted" | "rejected" | "done">(),
  createdAt: text("created_at")
    .default(sql`(CURRENT_TIMESTAMP)`)
    .notNull(),
});
