import { Hono } from "hono";
import { drizzle } from "drizzle-orm/d1";
import { Bindings } from "..";
import { modelsTable } from "../db/schema/models";
import { z } from "zod";
import { zValidator } from "@hono/zod-validator";
import { eq } from "drizzle-orm";

const app = new Hono<{ Bindings: Bindings }>();

app.get("/", async (c) => {
  const db = drizzle(c.env.DB);
  const result = await db.select().from(modelsTable).all();

  return c.json({
    status: true,
    data: result,
  });
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
