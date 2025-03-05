import { Hono } from "hono";
import { drizzle } from "drizzle-orm/d1";
import { Bindings } from "..";
import { z } from "zod";
import { zValidator } from "@hono/zod-validator";
import { and, eq } from "drizzle-orm";
import { modelsTable } from "../db/schema/models";
import {
  modelTradeConditionOptionsRelations,
  modelTradeConditionOptionsTable,
} from "../db/schema/modelTradeConditionOptions";
import { tradeOffersTable } from "../db/schema/tradeOffers";
import {
  modelTradeConditionQuestionsRelations,
  modelTradeConditionQuestionsTable,
} from "../db/schema/modelTradeConditionsQuestions";

const app = new Hono<{ Bindings: Bindings }>();

app.post(
  "/getOffer",
  zValidator(
    "json",
    z.object({
      modelId: z.number(),
      selections: z.array(
        z.object({
          questionId: z.number(),
          optionId: z.number(),
        }),
      ),
    }),
  ),
  async (c) => {
    const { modelId, selections } = c.req.valid("json");
    const db = drizzle(c.env.DB, {
      schema: {
        modelsTable,
        modelTradeConditionOptionsTable,
        modelTradeConditionOptionsRelations,
        modelTradeConditionQuestionsRelations,
        modelTradeConditionQuestionsTable,
        tradeOffersTable,
      },
    });

    try {
      const model = await db.query.modelsTable.findFirst({
        where: eq(modelsTable.id, modelId),
      });

      if (!model) {
        return c.json({ status: false, message: "Model not found" });
      }
      const expectedQuestions =
        await db.query.modelTradeConditionQuestionsTable.findMany({
          where: eq(modelTradeConditionQuestionsTable.modelId, modelId),
          with: {
            options: true,
          },
        });

      const expectedQuestionsNumber = expectedQuestions.filter(
        (q) => q.options.length > 0,
      ).length;

      const expectedQuestionIds = new Set(
        expectedQuestions.filter((q) => q.options.length > 0).map((q) => q.id),
      );

      if (selections.length !== expectedQuestionsNumber) {
        return c.json({
          status: false,
          message: `Invalid selections. #V001`,
        });
      }

      for (const selection of selections) {
        if (!expectedQuestionIds.has(selection.questionId)) {
          return c.json({
            status: false,
            message: `Invalid selections. #V002`,
          });
        }
      }

      const optionIds = selections.map((sel) => sel.optionId);
      const options = expectedQuestions
        .map((q) => q.options)
        .flat()
        .filter((q) => optionIds.includes(q.id));

      const optionMap = new Map(options.map((o) => [o.id, o]));

      for (const selection of selections) {
        const opt = optionMap.get(selection.optionId);
        if (!opt) {
          return c.json({
            status: false,
            message: `Invalid selection #V003`,
          });
        }
        if (opt.questionId !== selection.questionId) {
          return c.json({
            status: false,
            message: `Invalid selection #V004`,
          });
        }
      }

      const totalDeduction = options.reduce(
        (sum, option) => sum + option.deduction,
        0,
      );

      const offerPrice = model.maxTradeValue - totalDeduction;
      const offerRecord = await db
        .insert(tradeOffersTable)
        .values({
          modelId,
          selections: JSON.stringify(selections),
          offerPrice,
        })
        .returning();

      return c.json({
        status: true,
        data: { offerId: offerRecord[0].id, offerPrice },
      });
    } catch (error) {
      return c.json({
        status: false,
        message: (error as Error).message,
      });
    }
  },
);

app.post(
  "/acceptOffer",
  zValidator(
    "json",
    z.object({
      offerId: z.number(),
      firstName: z.string().min(1),
      lastName: z.string().min(1),
      email: z.string().email(),
      phoneNumber: z.string().min(10), // Telefon numarası minimum 10 haneli
    }),
  ),
  async (c) => {
    const { offerId, firstName, lastName, email, phoneNumber } =
      c.req.valid("json");
    const db = drizzle(c.env.DB, {
      schema: {
        modelsTable,
        modelTradeConditionOptionsTable,
        modelTradeConditionOptionsRelations,
        modelTradeConditionQuestionsRelations,
        modelTradeConditionQuestionsTable,
        tradeOffersTable,
      },
    });

    try {
      const offer = await db.query.tradeOffersTable.findFirst({
        where: and(
          eq(tradeOffersTable.id, offerId),
          eq(tradeOffersTable.status, "draft"),
        ),
      });

      if (!offer) {
        return c.json({ status: false, message: "Offer not found #O001" });
      }

      await db
        .update(tradeOffersTable)
        .set({
          firstName,
          lastName,
          email,
          phoneNumber,
          status: "pending",
        })
        .where(eq(tradeOffersTable.id, offerId));

      return c.json({
        status: true,
        data: { offerId, message: "Offer accepted" },
      });
    } catch (error) {
      return c.json({
        status: false,
        message: (error as Error).message,
      });
    }
  },
);

export default app;
