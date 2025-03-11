import { createFileRoute, redirect } from "@tanstack/react-router";
//@ts-expect-error: i18n is not a module
import i18n from "../../i18n";
import { useModels } from "@/hooks/useModels";
import { ModelsTable } from "@/components/core/models-table";

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
  const { data } = useModels({});
  const models = data?.data;
  return (
    <>
      <ModelsTable data={models ?? []} />
    </>
  );
}
