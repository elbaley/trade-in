import { Hono } from "hono";
import companies from "./routes/companies";
import models from "./routes/models";

export type Bindings = {
  DB: D1Database;
};

const app = new Hono<{ Bindings: Bindings }>();

app.route("/companies", companies);
app.route("/models", models);

export default app;
