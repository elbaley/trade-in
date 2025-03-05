import { Hono } from "hono";
import { drizzle } from "drizzle-orm/d1";
import { Bindings } from "..";
import { modelTradeConditionQuestionsTable } from "../db/schema/modelTradeConditionsQuestions";
import { z } from "zod";
import { zValidator } from "@hono/zod-validator";
import { and, eq } from "drizzle-orm";
import { translationsTable } from "../db/schema/translations";

const app = new Hono<{ Bindings: Bindings }>();

app.get("/:modelId", async (c) => {
  const modelId = c.req.param("modelId");
  const db = drizzle(c.env.DB);
  const result = await db
    .select()
    .from(modelTradeConditionQuestionsTable)
    .where(eq(modelTradeConditionQuestionsTable.modelId, Number(modelId)))
    .all();

  return c.json({
    status: true,
    data: result,
  });
});

app.post(
  "/:modelId",
  zValidator(
    "json",
    z.object({
      tr: z.string().min(2),
      en: z.string().min(2),
    }),
  ),
  async (c) => {
    const modelId = Number(c.req.param("modelId"));
    const { tr, en } = c.req.valid("json");
    const db = drizzle(c.env.DB);
    const translationKey = crypto.randomUUID();

    // Add translations
    try {
      await db.insert(translationsTable).values([
        {
          key: translationKey,
          locale: "tr-TR",
          text: tr,
        },
        {
          key: translationKey,
          locale: "en-US",
          text: en,
        },
      ]);
    } catch (error) {
      return c.json({
        status: false,
        message: (error as Error).message,
      });
    }

    try {
      const result = await db
        .insert(modelTradeConditionQuestionsTable)
        .values({
          modelId,
          questionKey: translationKey,
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
      tr: z.string().min(2).optional(),
      en: z.string().min(2).optional(),
    }),
  ),
  async (c) => {
    const id = c.req.param("id");
    const { tr, en } = c.req.valid("json");
    const db = drizzle(c.env.DB);
    try {
      const { questionKey } = await db
        .select({
          questionKey: modelTradeConditionQuestionsTable.questionKey,
        })
        .from(modelTradeConditionQuestionsTable)
        .where(eq(modelTradeConditionQuestionsTable.id, Number(id)))
        .then((rows) => rows[0]);

      const updatePromises = [];

      if (en) {
        updatePromises.push(
          db
            .update(translationsTable)
            .set({ text: en })
            .where(
              and(
                eq(translationsTable.key, questionKey),
                eq(translationsTable.locale, "en-US"),
              ),
            )
            .returning(),
        );
      }
      if (tr) {
        updatePromises.push(
          db
            .update(translationsTable)
            .set({ text: tr })
            .where(
              and(
                eq(translationsTable.key, questionKey),
                eq(translationsTable.locale, "tr-TR"),
              ),
            )
            .returning(),
        );
      }
      const results = await Promise.all(updatePromises);

      return c.json({
        status: true,
        data: results,
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
    const { questionKey } = await db
      .select({
        questionKey: modelTradeConditionQuestionsTable.questionKey,
      })
      .from(modelTradeConditionQuestionsTable)
      .where(eq(modelTradeConditionQuestionsTable.id, Number(id)))
      .then((rows) => rows[0]);

    // Delete translations
    await db
      .delete(translationsTable)
      .where(eq(translationsTable.key, questionKey));

    const result = await db
      .delete(modelTradeConditionQuestionsTable)
      .where(eq(modelTradeConditionQuestionsTable.id, Number(id)))
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
