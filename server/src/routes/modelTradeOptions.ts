import { Hono } from "hono";
import { drizzle } from "drizzle-orm/d1";
import { Bindings } from "..";
import { z } from "zod";
import { zValidator } from "@hono/zod-validator";
import { and, eq } from "drizzle-orm";
import { translationsTable } from "../db/schema/translations";
import { modelTradeConditionOptionsTable } from "../db/schema/modelTradeConditionOptions";

const app = new Hono<{ Bindings: Bindings }>();

app.get("/:questionId", async (c) => {
  const questionId = c.req.param("questionId");
  const db = drizzle(c.env.DB);
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
  zValidator(
    "json",
    z.object({
      label_tr: z.string().min(3),
      label_en: z.string().min(3),
      description_tr: z.string().min(3),
      description_en: z.string().min(3),
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
  zValidator(
    "json",
    z.object({
      label_tr: z.string().min(3).optional(),
      label_en: z.string().min(3).optional(),
      description_tr: z.string().min(3).optional(),
      description_en: z.string().min(3).optional(),
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

      if (deduction) {
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

app.delete("/:id", async (c) => {
  const id = c.req.param("id");
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

    // Delete translations
    await db
      .delete(translationsTable)
      .where(eq(translationsTable.key, labelKey));

    await db
      .delete(translationsTable)
      .where(eq(translationsTable.key, descriptionKey));

    const result = await db
      .delete(modelTradeConditionOptionsTable)
      .where(eq(modelTradeConditionOptionsTable.id, Number(id)))
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
