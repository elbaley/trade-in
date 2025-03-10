import { Hono } from "hono";
import { HonoEnv } from "./types";
import auth from "./routes/auth";
import companies from "./routes/companies";
import tradeOffers from "./routes/tradeOffers";
import models from "./routes/models";
import modelTradeQuestions from "./routes/modelTradeQuestions";
import modelTradeOptions from "./routes/modelTradeOptions";
import {
  sessionMiddleware,
  // validateRequestOrigin
} from "./auth/auth";
import stats from "./routes/stats";

const app = new Hono<HonoEnv>();

//app.use("*", validateRequestOrigin);
app.use("*", sessionMiddleware);

app.route("/auth", auth);
app.route("/companies", companies);
app.route("/models", models);
app.route("/modelTradeQuestions", modelTradeQuestions);
app.route("/modelTradeOptions", modelTradeOptions);
app.route("/tradeOffers", tradeOffers);
app.route("/stats", stats);

export default app;
