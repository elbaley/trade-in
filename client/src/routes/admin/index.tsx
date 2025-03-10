import { createFileRoute, redirect } from "@tanstack/react-router";
//@ts-expect-error: i18n is not a module
import i18n from "../../i18n";
import { statsOptions } from "@/api/stats";
import { useSuspenseQuery } from "@tanstack/react-query";

export const Route = createFileRoute("/admin/")({
  loader: ({ context }) => context.queryClient.ensureQueryData(statsOptions),
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
      meta: [{ title: `${i18n.t("Dashboard")} - ` + "Trade In" }],
    };
  },
});

function RouteComponent() {
  const statsQuery = useSuspenseQuery(statsOptions);
  const stats = statsQuery.data.data;

  return (
    <>
      <div className="grid auto-rows-min gap-4 sm:grid-cols-2 xl:grid-cols-4">
        <div className="aspect-video relative rounded-sm bg-muted/50 px-5 py-3">
          <p className="text-secondary tracking-tight text-md">
            Total Companies
          </p>
          <h2 className="text-6xl font-medium pt-2">{stats.totalCompanies}</h2>
          <hr className="absolute bottom-1 h-1 w-full left-0 bg-blue-500" />
        </div>
        <div className="aspect-video relative rounded-sm bg-muted/50 px-5 py-3">
          <p className="text-secondary tracking-tight text-md">Total Models</p>
          <h2 className="text-6xl font-medium pt-2">{stats.totalModels}</h2>
          <hr className="absolute bottom-1 h-1 w-full left-0 bg-blue-500" />
        </div>
        <div className="aspect-video relative rounded-sm bg-muted/50 px-5 py-3">
          <p className="text-secondary tracking-tight text-md">
            Total Trade Offers
          </p>
          <h2 className="text-6xl font-medium pt-2">
            {stats.totalTradeOffers}
          </h2>
          <hr className="absolute bottom-1 h-1 w-full left-0 bg-blue-500" />
        </div>
        <div className="aspect-video relative rounded-sm bg-muted/50 px-5 py-3">
          <p className="text-secondary tracking-tight text-md">
            Pending Trade Offers
          </p>
          <h2 className="text-6xl font-medium pt-2">
            {stats.pendingTradeOffers}
          </h2>
          <hr className="absolute bottom-1 h-1 w-full left-0 bg-blue-500" />
        </div>
      </div>
    </>
  );
}
