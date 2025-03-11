import { Hono } from "hono";
import { HonoEnv } from "./types";
import auth from "./routes/auth";
import { cors } from "hono/cors";
import companies from "./routes/companies";
import tradeOffers from "./routes/tradeOffers";
import models from "./routes/models";
import modelTradeQuestions from "./routes/modelTradeQuestions";
import { env } from "hono/adapter";
import modelTradeOptions from "./routes/modelTradeOptions";
import {
  sessionMiddleware,
  // validateRequestOrigin
} from "./auth/auth";
import stats from "./routes/stats";
import seed from "./routes/seed";

const app = new Hono<HonoEnv>();

app.use("*", async (c, next) => {
  const corsMiddleware = cors({
    origin: env<{ ALLOW_ORIGIN: string }>(c).ALLOW_ORIGIN,
    allowHeaders: [
      "Origin",
      "Content-Type",
      "Authorization",
      "X-Custom-Header",
      "Upgrade-Insecure-Requests",
    ],
    allowMethods: ["GET", "OPTIONS", "POST", "PUT", "DELETE"],
    credentials: true,
  });
  return await corsMiddleware(c, next);
});

//app.use("*", validateRequestOrigin);
app.use("*", sessionMiddleware);

app.route("/auth", auth);
app.route("/companies", companies);
app.route("/models", models);
app.route("/modelTradeQuestions", modelTradeQuestions);
app.route("/modelTradeOptions", modelTradeOptions);
app.route("/tradeOffers", tradeOffers);
app.route("/stats", stats);
app.route("/seed", seed);

export default app;
