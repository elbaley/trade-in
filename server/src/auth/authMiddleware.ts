import { Context, Next } from "hono";
import { HonoEnv } from "../types";

export const authMiddleware = async (c: Context<HonoEnv, "*">, next: Next) => {
  const user = c.get("user");
  if (!user) {
    return c.json({ status: false, message: "Unauthorized" }, 401);
  }
  if (user.email === "demo@furkanleba.com" && c.req.method !== "GET") {
    return c.json(
      { status: false, message: "Demo user can't perform this action" },
      401,
    );
  }

  return next();
};
