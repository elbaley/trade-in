import { Hono } from "hono";
import { HonoEnv } from "../types";
import { zValidator } from "@hono/zod-validator";
import { z } from "zod";
import { drizzle } from "drizzle-orm/d1";
import { usersTable } from "../db/schema/users";
import { sessionsTable } from "../db/schema/sessions";
import { initializeLucia } from "../auth/auth";
import { generateId, Scrypt } from "lucia";
import { eq } from "drizzle-orm";

const app = new Hono<HonoEnv>();

app.post(
  "/signup",
  zValidator(
    "json",
    z.object({
      email: z.string().email(),
      password: z.string().min(1),
      firstName: z.string().min(1),
      lastName: z.string().min(2),
    }),
  ),
  async (c) => {
    const db = drizzle(c.env.DB, {
      schema: {
        usersTable,
        sessionsTable,
      },
    });
    const { email, firstName, lastName, password } = c.req.valid("json");
    const lucia = initializeLucia(c.env.DB);
    const hashedPassword = await new Scrypt().hash(password);
    const userId = generateId(15);

    try {
      await db
        .insert(usersTable)
        .values({
          id: userId,
          email,
          firstName,
          lastName,
          hashedPassword,
        })
        .returning();

      const session = await lucia.createSession(userId, {});
      const sessionCookie = lucia.createSessionCookie(session.id);
      c.header("Set-Cookie", sessionCookie.serialize(), {
        append: true,
      });

      return c.json({
        status: true,
        data: {
          firstName,
          lastName,
        },
      });
    } catch (error) {
      console.log(error);
      return c.json({
        status: false,
        message: "Error signing up!",
      });
    }
  },
);

app.post(
  "/login",
  zValidator(
    "json",
    z.object({
      email: z.string().email(),
      password: z.string().min(1),
    }),
  ),
  async (c) => {
    const db = drizzle(c.env.DB, {
      schema: {
        usersTable,
        sessionsTable,
      },
    });
    const { email, password } = c.req.valid("json");
    const lucia = initializeLucia(c.env.DB);

    try {
      const user = await db.query.usersTable.findFirst({
        where: eq(usersTable.email, email),
      });

      if (!user) {
        return c.json({
          status: false,
          message: "Invalid email or password.",
        });
      }
      const validPassword = await new Scrypt().verify(
        user.hashedPassword,
        password,
      );
      if (!validPassword) {
        return c.json({
          status: false,
          message: "Invalid email or password.",
        });
      }

      const session = await lucia.createSession(user.id, {});
      const sessionCookie = lucia.createSessionCookie(session.id);
      c.header("Set-Cookie", sessionCookie.serialize(), {
        append: true,
      });
      return c.json({
        status: true,
        data: {
          firstName: user.firstName,
          lastName: user.lastName,
          fullName: user.fullName,
          email: user.email,
        },
      });
    } catch (error) {
      console.log(error);
      return c.json({
        status: false,
        message: "Error signing in!",
      });
    }
  },
);

app.post("/logout", async (c) => {
  const lucia = initializeLucia(c.env.DB);
  const session = c.get("session");
  if (session) {
    await lucia.invalidateSession(session.id);
  }
  const sessionCookie = lucia.createBlankSessionCookie();
  c.header("Set-Cookie", sessionCookie.serialize(), {
    append: true,
  });
  return c.json({
    status: true,
    message: "Logged out.",
  });
});

export default app;
