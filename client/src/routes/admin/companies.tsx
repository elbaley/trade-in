import { createFileRoute, redirect } from "@tanstack/react-router";
//@ts-expect-error: i18n is not a module
import i18n from "../../i18n";

export const Route = createFileRoute("/admin/companies")({
  beforeLoad: ({ context }) => {
    const { isLogged } = context.authentication;
    if (!isLogged) {
      throw redirect({ to: "/" });
    }
  },
  component: RouteComponent,
  head: () => {
    i18n.t("tradeIn");
    return {
      meta: [{ title: `${i18n.t("Companies")} - ` + "Trade In" }],
    };
  },
});

function RouteComponent() {
  return <h2>Companies</h2>;
}
