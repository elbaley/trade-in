import { Session, User } from "lucia";

export type HonoEnv = {
  Bindings: {
    DB: D1Database;
  };
  Variables: {
    user: UserInfo | null;
    session: Session | null;
  };
};

export interface UserInfo extends User {
  fullName: string;
  email: string;
}
