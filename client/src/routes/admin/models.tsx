import { createFileRoute, redirect } from "@tanstack/react-router";
//@ts-expect-error: i18n is not a module
import i18n from "../../i18n";

export const Route = createFileRoute("/admin/models")({
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
      meta: [{ title: `${i18n.t("Models")} - ` + "Trade In" }],
    };
  },
});

function RouteComponent() {
  return (
    <>
      <h2>Models</h2>
      <div className="grid auto-rows-min gap-4 md:grid-cols-3">
        <div className="aspect-video rounded-xl bg-muted/50" />
        <div className="aspect-video rounded-xl bg-muted/50" />
        <div className="aspect-video rounded-xl bg-muted/50" />
      </div>
      <div className="min-h-[100vh] flex-1 rounded-xl bg-muted/50 md:min-h-min" />
    </>
  );
}
