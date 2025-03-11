import { Hono } from "hono";
import { drizzle } from "drizzle-orm/d1";
import { modelsTable } from "../db/schema/models";
import { z } from "zod";
import { zValidator } from "@hono/zod-validator";
import { eq, inArray } from "drizzle-orm";
import {
  modelTradeConditionQuestionsRelations,
  modelTradeConditionQuestionsTable,
} from "../db/schema/modelTradeConditionsQuestions";
import {
  modelTradeConditionOptionsRelations,
  modelTradeConditionOptionsTable,
} from "../db/schema/modelTradeConditionOptions";
import { translationsTable } from "../db/schema/translations";
import { authMiddleware } from "../auth/authMiddleware";
import { HonoEnv } from "../types";

const app = new Hono<HonoEnv>();

app.get("/", async (c) => {
  const companyId = c.req.query("companyId");
  const db = drizzle(c.env.DB);
  const result = companyId
    ? await db
        .select()
        .from(modelsTable)
        .where(eq(modelsTable.companyId, Number(companyId)))
        .all()
    : await db.select().from(modelsTable).all();

  return c.json({
    status: true,
    data: result,
  });
});

app.get("/:id", async (c) => {
  const lang = c.req.query("lang") ?? "en-US";
  const id = parseInt(c.req.param("id"), 10);

  if (isNaN(id)) {
    return c.json({ status: false, message: "Invalid ID" });
  }

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
    const model = await db.query.modelsTable.findFirst({
      where: eq(modelsTable.id, id),
    });

    if (!model) {
      return c.json({ status: false, message: "Model not found" });
    }

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

    const options = questions.flatMap((q) => q.options);

    const translationKeys: string[] = [
      ...questions.map((q) => q.questionKey),
      ...options.map((o) => o.labelKey),
      ...options.map((o) => o.descriptionKey),
    ];

    const translations = await db.query.translationsTable.findMany({
      where: (row) => inArray(row.key, translationKeys),
    });

    const translationMap: Record<
      string,
      Record<string, string>
    > = translations.reduce(
      (acc, t) => {
        if (!acc[t.key]) acc[t.key] = {};
        acc[t.key][t.locale] = t.text;
        return acc;
      },
      {} as Record<string, Record<string, string>>,
    );

    const formattedQuestions = questions
      .filter((q) => q.options.length > 0)
      .map((q) => ({
        id: q.id,
        question: translationMap[q.questionKey]?.[lang] ?? q.questionKey,
        options: options
          .filter((o) => o.questionId === q.id)
          .map((o) => ({
            id: o.id,
            label: translationMap[o.labelKey]?.[lang] || o.labelKey,
            label_tr: translationMap[o.labelKey]?.["tr-TR"] || o.labelKey,
            label_en: translationMap[o.labelKey]?.["en-US"] || o.labelKey,
            description:
              translationMap[o.descriptionKey]?.[lang] || o.descriptionKey,
            description_tr:
              translationMap[o.descriptionKey]?.["tr-TR"] || o.descriptionKey,
            description_en:
              translationMap[o.descriptionKey]?.["en-US"] || o.descriptionKey,
            deduction: o.deduction,
          })),
      }));

    return c.json({
      status: true,
      data: { ...model, questions: formattedQuestions },
    });
  } catch (error) {
    return c.json({
      status: false,
      message: error instanceof Error ? error.message : "Unknown error",
    });
  }
});

app.post(
  "/",
  authMiddleware,
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
  authMiddleware,
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

app.delete("/:id", authMiddleware, async (c) => {
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
