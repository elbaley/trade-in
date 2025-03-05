import { int, sqliteTable, text } from "drizzle-orm/sqlite-core";
import { modelsTable } from "./models";
import { relations } from "drizzle-orm";
import { modelTradeConditionOptionsTable } from "./modelTradeConditionOptions";

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

export const modelTradeConditionQuestionsRelations = relations(
  modelTradeConditionQuestionsTable,
  ({ one, many }) => ({
    model: one(modelsTable, {
      fields: [modelTradeConditionQuestionsTable.modelId],
      references: [modelsTable.id],
    }),
    options: many(modelTradeConditionOptionsTable),
  }),
);
