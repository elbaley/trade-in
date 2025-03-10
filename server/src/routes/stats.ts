import { Hono } from "hono";
import { drizzle } from "drizzle-orm/d1";
import { companiesTable } from "../db/schema/companies";
import { HonoEnv } from "../types";
import { modelsTable } from "../db/schema/models";
import { tradeOffersTable } from "../db/schema/tradeOffers";
import { count, eq } from "drizzle-orm";

const app = new Hono<HonoEnv>();

app.get("/", async (c) => {
  const db = drizzle(c.env.DB);

  const totalCompanies = await db
    .select({ count: count() })
    .from(companiesTable)
    .get();
  const totalModels = await db
    .select({ count: count() })
    .from(modelsTable)
    .get();
  const totalTradeOffers = await db
    .select({ count: count() })
    .from(tradeOffersTable)
    .get();
  const pendingTradeOffers = await db
    .select({ count: count() })
    .from(tradeOffersTable)
    .where(eq(tradeOffersTable.status, "pending"))
    .get();

  return c.json({
    status: true,
    data: {
      totalCompanies: totalCompanies?.count,
      totalModels: totalModels?.count,
      totalTradeOffers: totalTradeOffers?.count,
      pendingTradeOffers: pendingTradeOffers?.count,
    },
  });
});

export default app;
