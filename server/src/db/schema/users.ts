import { SQL, sql } from "drizzle-orm";
import { sqliteTable, text } from "drizzle-orm/sqlite-core";

export const usersTable = sqliteTable("users", {
  id: text("id").notNull().primaryKey(),
  email: text("email").notNull().unique(),
  firstName: text("first_name"),
  lastName: text("last_name"),
  fullName: text("full_name").generatedAlwaysAs(
    (): SQL => sql`${usersTable.firstName} || ' ' ||  ${usersTable.lastName}`,
  ),
  hashedPassword: text("hashed_password").notNull(),
});
