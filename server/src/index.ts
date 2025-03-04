import { Hono } from "hono";
import companies from "./routes/companies";
import models from "./routes/models";
import modelTradeQuestions from "./routes/modelTradeQuestions";

export type Bindings = {
  DB: D1Database;
};

const app = new Hono<{ Bindings: Bindings }>();
app.route("/companies", companies);
app.route("/models", models);
app.route("/modelTradeQuestions", modelTradeQuestions);

export default app;
