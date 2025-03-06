import { D1Adapter } from "@lucia-auth/adapter-sqlite";
import { verifyRequestOrigin } from "lucia";
import { Context, Next } from "hono";
import { Lucia } from "lucia";
import { HonoEnv, UserInfo } from "../types";
import { getCookie } from "hono/cookie";

interface DatabaseUserAttributes {
  email: string;
  full_name: string;
}

declare module "lucia" {
  interface Register {
    Auth: ReturnType<typeof initializeLucia>;
    DatabaseUserAttributes: DatabaseUserAttributes;
  }
}

export function initializeLucia(D1: D1Database) {
  const adapter = new D1Adapter(D1, {
    user: "users",
    session: "sessions",
  });
  return new Lucia(adapter, {
    sessionCookie: {
      attributes: {
        secure: false,
      },
    },

    getUserAttributes: (attributes) => {
      return {
        email: attributes.email,
        fullName: attributes.full_name,
      };
    },
  });
}

export const validateRequestOrigin = async (
  c: Context<HonoEnv>,
  next: Next,
) => {
  if (c.req.method === "GET") {
    return next();
  }
  const originHeader = c.req.header("Origin");
  const hostHeader = c.req.header("Host");
  if (
    !originHeader ||
    !hostHeader ||
    !verifyRequestOrigin(originHeader, [hostHeader])
  ) {
    return c.body(null, 403);
  }
  return next();
};

export const sessionMiddleware = async (c: Context<HonoEnv>, next: Next) => {
  const lucia = initializeLucia(c.env.DB);
  const sessionId = getCookie(c, lucia.sessionCookieName) ?? null;
  if (!sessionId) {
    c.set("user", null);
    c.set("session", null);
    return next();
  }
  const { session, user } = await lucia.validateSession(sessionId);
  if (session && session.fresh) {
    c.header("Set-Cookie", lucia.createSessionCookie(session.id).serialize(), {
      append: true,
    });
  }
  if (!session) {
    c.header("Set-Cookie", lucia.createBlankSessionCookie().serialize(), {
      append: true,
    });
  }
  c.set("user", user as UserInfo);
  c.set("session", session);
  return next();
};
