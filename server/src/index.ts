import { Hono } from "hono";
import companies from "./routes/companies";

export type Bindings = {
  DB: D1Database;
};

const app = new Hono<{ Bindings: Bindings }>();

app.route("/companies", companies);

export default app;
