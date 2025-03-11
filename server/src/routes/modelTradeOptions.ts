import { Hono } from "hono";
import { drizzle } from "drizzle-orm/d1";
import { z } from "zod";
import { zValidator } from "@hono/zod-validator";
import { and, eq, inArray } from "drizzle-orm";
import { translationsTable } from "../db/schema/translations";
import { modelTradeConditionOptionsTable } from "../db/schema/modelTradeConditionOptions";
import { authMiddleware } from "../auth/authMiddleware";
import { HonoEnv } from "../types";
import { modelTradeConditionQuestionsTable } from "../db/schema/modelTradeConditionsQuestions";

const app = new Hono<HonoEnv>();

app.get("/:questionId", async (c) => {
  const questionId = c.req.param("questionId");
  const db = drizzle(c.env.DB, {
    schema: {
      translationsTable,
    },
  });
  const result = await db
    .select()
    .from(modelTradeConditionOptionsTable)
    .where(eq(modelTradeConditionOptionsTable.questionId, Number(questionId)))
    .all();

  return c.json({
    status: true,
    data: result,
  });
});

app.post(
  "/:questionId",
  authMiddleware,
  zValidator(
    "json",
    z.object({
      label_tr: z.string().min(2),
      label_en: z.string().min(2),
      description_tr: z.string().min(2),
      description_en: z.string().min(2),
      deduction: z.number().min(0),
    }),
  ),
  async (c) => {
    const questionId = Number(c.req.param("questionId"));
    const { label_en, label_tr, description_tr, description_en, deduction } =
      c.req.valid("json");
    const db = drizzle(c.env.DB);
    const labelTranslationKey = crypto.randomUUID();
    const descriptionTranslationKey = crypto.randomUUID();

    // Add translations
    try {
      await db.insert(translationsTable).values([
        {
          key: labelTranslationKey,
          locale: "tr-TR",
          text: label_tr,
        },
        {
          key: labelTranslationKey,
          locale: "en-US",
          text: label_en,
        },
        {
          key: descriptionTranslationKey,
          locale: "tr-TR",
          text: description_tr,
        },
        {
          key: descriptionTranslationKey,
          locale: "en-US",
          text: description_en,
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
        .insert(modelTradeConditionOptionsTable)
        .values({
          questionId: questionId,
          labelKey: labelTranslationKey,
          descriptionKey: descriptionTranslationKey,
          deduction,
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
      label_tr: z.string().min(2).optional(),
      label_en: z.string().min(2).optional(),
      description_tr: z.string().min(2).optional(),
      description_en: z.string().min(2).optional(),
      deduction: z.number().min(0).optional(),
    }),
  ),
  async (c) => {
    const id = c.req.param("id");
    const { label_en, label_tr, deduction, description_en, description_tr } =
      c.req.valid("json");
    const db = drizzle(c.env.DB);
    try {
      const { labelKey, descriptionKey } = await db
        .select({
          labelKey: modelTradeConditionOptionsTable.labelKey,
          descriptionKey: modelTradeConditionOptionsTable.descriptionKey,
        })
        .from(modelTradeConditionOptionsTable)
        .where(eq(modelTradeConditionOptionsTable.id, Number(id)))
        .then((rows) => rows[0]);

      const updatePromises = [];

      if (label_en) {
        updatePromises.push(
          db
            .update(translationsTable)
            .set({ text: label_en })
            .where(
              and(
                eq(translationsTable.key, labelKey),
                eq(translationsTable.locale, "en-US"),
              ),
            )
            .returning(),
        );
      }
      if (label_tr) {
        updatePromises.push(
          db
            .update(translationsTable)
            .set({ text: label_tr })
            .where(
              and(
                eq(translationsTable.key, labelKey),
                eq(translationsTable.locale, "tr-TR"),
              ),
            )
            .returning(),
        );
      }

      if (description_en) {
        updatePromises.push(
          db
            .update(translationsTable)
            .set({ text: description_en })
            .where(
              and(
                eq(translationsTable.key, descriptionKey),
                eq(translationsTable.locale, "en-US"),
              ),
            )
            .returning(),
        );
      }

      if (description_tr) {
        updatePromises.push(
          db
            .update(translationsTable)
            .set({ text: description_tr })
            .where(
              and(
                eq(translationsTable.key, descriptionKey),
                eq(translationsTable.locale, "tr-TR"),
              ),
            )
            .returning(),
        );
      }

      if (typeof deduction === "number") {
        updatePromises.push(
          db
            .update(modelTradeConditionOptionsTable)
            .set({ deduction: deduction })
            .where(eq(modelTradeConditionOptionsTable.id, Number(id)))
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

app.delete("/:id", authMiddleware, async (c) => {
  const id = Number(c.req.param("id"));
  const db = drizzle(c.env.DB);

  try {
    await db.transaction(async (trx) => {
      const options = await trx
        .select({
          id: modelTradeConditionOptionsTable.id,
          labelKey: modelTradeConditionOptionsTable.labelKey,
          descriptionKey: modelTradeConditionOptionsTable.descriptionKey,
        })
        .from(modelTradeConditionOptionsTable)
        .where(eq(modelTradeConditionOptionsTable.questionId, id));

      if (options.length > 0) {
        const optionIds = options.map((opt) => opt.id);
        await trx
          .delete(modelTradeConditionOptionsTable)
          .where(inArray(modelTradeConditionOptionsTable.id, optionIds));

        const labelKeys = options.map((opt) => opt.labelKey);
        const descriptionKeys = options.map((opt) => opt.descriptionKey);
        await trx
          .delete(translationsTable)
          .where(inArray(translationsTable.key, labelKeys));
        await trx
          .delete(translationsTable)
          .where(inArray(translationsTable.key, descriptionKeys));
      }

      const questionRecord = await trx
        .select({
          questionKey: modelTradeConditionQuestionsTable.questionKey,
        })
        .from(modelTradeConditionQuestionsTable)
        .where(eq(modelTradeConditionQuestionsTable.id, id))
        .then((rows) => rows[0]);

      await trx
        .delete(modelTradeConditionQuestionsTable)
        .where(eq(modelTradeConditionQuestionsTable.id, id));

      await trx
        .delete(translationsTable)
        .where(eq(translationsTable.key, questionRecord.questionKey));
    });

    return c.json({
      status: true,
      data: { id },
    });
  } catch (error) {
    return c.json({
      status: false,
      message: (error as Error).message,
    });
  }
});

export default app;
