import { int, sqliteTable, text } from "drizzle-orm/sqlite-core";
import { modelTradeConditionQuestionsTable } from "./modelTradeConditionsQuestions";

export const modelTradeConditionOptionsTable = sqliteTable(
  "model_trade_condition_options",
  {
    id: int("id").primaryKey({ autoIncrement: true }),
    questionId: int("question_id")
      .notNull()
      .references(() => modelTradeConditionQuestionsTable.id),
    label: text("label").notNull(),
    deduction: int("deduction").notNull(),
    description: text("description"),
  },
);
