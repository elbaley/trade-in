import { Hono } from "hono";
import { drizzle } from "drizzle-orm/d1";
import { Bindings } from "..";
import { companiesTable } from "../db/schema/companies";
import { z } from "zod";
import { zValidator } from "@hono/zod-validator";
import { eq } from "drizzle-orm";

const app = new Hono<{ Bindings: Bindings }>();

app.get("/", async (c) => {
  const db = drizzle(c.env.DB);
  const result = await db.select().from(companiesTable).all();

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
      logoUrl: z.string().min(1).optional(),
    }),
  ),
  async (c) => {
    const { name, logoUrl } = c.req.valid("json");
    const db = drizzle(c.env.DB);
    try {
      const result = await db
        .insert(companiesTable)
        .values({ name, logoUrl })
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
      name: z.string().min(1),
      logoUrl: z.string().min(1).optional(),
    }),
  ),
  async (c) => {
    const id = c.req.param("id");
    const { name, logoUrl } = c.req.valid("json");
    const db = drizzle(c.env.DB);
    try {
      const result = await db
        .update(companiesTable)
        .set({ name, logoUrl })
        .where(eq(companiesTable.id, Number(id)))
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
      .delete(companiesTable)
      .where(eq(companiesTable.id, Number(id)))
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
