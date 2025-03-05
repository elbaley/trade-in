import { Hono } from "hono";
import { drizzle } from "drizzle-orm/d1";
import { Bindings } from "..";
import { modelsTable } from "../db/schema/models";
import { z } from "zod";
import { zValidator } from "@hono/zod-validator";
import { eq } from "drizzle-orm";
import {
  modelTradeConditionQuestionsRelations,
  modelTradeConditionQuestionsTable,
} from "../db/schema/modelTradeConditionsQuestions";
import {
  modelTradeConditionOptionsRelations,
  modelTradeConditionOptionsTable,
} from "../db/schema/modelTradeConditionOptions";
import { translationsTable } from "../db/schema/translations";

const app = new Hono<{ Bindings: Bindings }>();

app.get("/", async (c) => {
  const db = drizzle(c.env.DB);
  const result = await db.select().from(modelsTable).all();

  return c.json({
    status: true,
    data: result,
  });
});

app.get("/:id", async (c) => {
  const lang = c.req.query("lang");
  const id = Number(c.req.param("id"));
  const db = drizzle(c.env.DB, {
    schema: {
      modelsTable,
      modelTradeConditionOptionsTable,
      modelTradeConditionQuestionsTable,
      modelTradeConditionQuestionsRelations,
      modelTradeConditionOptionsRelations,
      translationsTable,
    },
  });

  try {
    // 1. Get model
    const model = await db.query.modelsTable.findFirst({
      where: eq(modelsTable.id, id),
    });

    if (!model) {
      return c.json({ status: false, message: "Model not found" });
    }

    // 2. Get all questions related to the model
    const questions = await db.query.modelTradeConditionQuestionsTable.findMany(
      {
        where: eq(modelTradeConditionQuestionsTable.modelId, id),
        with: {
          options: true,
        },
      },
    );

    if (!questions.length) {
      return c.json({ status: true, data: { ...model, questions: [] } });
    }

    // 3. Get related options for each question
    const options = questions.map((q) => q.options).flat();

    // 4. Get translations for questions and options
    const translationKeys = [
      ...questions.map((q) => q.questionKey),
      ...options.map((o) => o.labelKey),
      ...options.map((o) => o.descriptionKey),
    ];

    const translations = await db.query.translationsTable.findMany({
      where: (row, { inArray, eq }) =>
        inArray(row.key, translationKeys) &&
        eq(row.locale, lang === "tr-TR" ? "tr-TR" : "en-US"),
    });

    const translationMap = Object.fromEntries(
      translations.map((t) => [t.key, t.text]),
    );

    // 5. Format the questions
    const formattedQuestions = questions
      .filter((q) => q.options.length > 0)
      .map((q) => ({
        id: q.id,
        question: translationMap[q.questionKey] ?? q.questionKey,
        options: options
          .filter((o) => o.questionId === q.id)
          .map((o) => ({
            id: o.id,
            label: translationMap[o.labelKey] || o.labelKey,
            description: translationMap[o.descriptionKey] || o.descriptionKey,
            deduction: o.deduction,
          })),
      }));

    return c.json({
      status: true,
      data: { ...model, questions: formattedQuestions },
    });
  } catch (error) {
    return c.json({ status: false, message: (error as Error).message });
  }
});

app.post(
  "/",
  zValidator(
    "json",
    z.object({
      name: z.string().min(1),
      companyId: z.number(),
      imageUrl: z.string().min(1).optional(),
      maxTradeValue: z.number(),
    }),
  ),
  async (c) => {
    const { name, companyId, maxTradeValue, imageUrl } = c.req.valid("json");
    const db = drizzle(c.env.DB);
    try {
      const result = await db
        .insert(modelsTable)
        .values({
          name,
          companyId,
          maxTradeValue,
          imageUrl,
        })
        .returning();
      return c.json({
        status: true,
        data: result,
      });
    } catch (error) {
      return c.json({
        status: false,
        message: (error as Error).message,
      });
    }
  },
);

app.put(
  "/:id",
  zValidator(
    "json",
    z.object({
      name: z.string().min(1).optional(),
      companyId: z.number().optional(),
      imageUrl: z.string().min(1).optional(),
      maxTradeValue: z.number().optional(),
    }),
  ),
  async (c) => {
    const id = c.req.param("id");
    const { name, companyId, maxTradeValue, imageUrl } = c.req.valid("json");
    const db = drizzle(c.env.DB);
    try {
      const result = await db
        .update(modelsTable)
        .set({ name, companyId, maxTradeValue, imageUrl })
        .where(eq(modelsTable.id, Number(id)))
        .returning();
      return c.json({
        status: true,
        data: result,
      });
    } catch (error) {
      return c.json({
        status: false,
        message: (error as Error).message,
      });
    }
  },
);

app.delete("/:id", async (c) => {
  const id = c.req.param("id");
  const db = drizzle(c.env.DB);
  try {
    const result = await db
      .delete(modelsTable)
      .where(eq(modelsTable.id, Number(id)))
      .returning();
    return c.json({
      status: true,
      data: result,
    });
  } catch (error) {
    return c.json({
      status: false,
      message: (error as Error).message,
    });
  }
});

export default app;
