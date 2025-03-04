import { int, sqliteTable, text } from "drizzle-orm/sqlite-core";
import { modelsTable } from "./models";

export const modelTradeConditionQuestionsTable = sqliteTable(
  "model_trade_condition_questions",
  {
    id: int("id").primaryKey({ autoIncrement: true }),
    modelId: int("model_id")
      .notNull()
      .references(() => modelsTable.id),
    questionKey: text("question_key").notNull(),
  },
);
