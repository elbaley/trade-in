import { AppSidebar } from "@/components/core/app-sidebar";
import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbPage,
  BreadcrumbSeparator,
} from "@/components/ui/breadcrumb";
import { Separator } from "@/components/ui/separator";
import {
  SidebarInset,
  SidebarProvider,
  SidebarTrigger,
} from "@/components/ui/sidebar";

import { Button } from "@/components/ui/button";
import { useAuth } from "@/hooks/useAuth";
import {
  createFileRoute,
  Link,
  Outlet,
  useMatches,
  useRouter,
} from "@tanstack/react-router";
import { useTranslation } from "react-i18next";
import { HeadContent } from "@tanstack/react-router";
// @ts-expect-error : dd
import i18n from "../../i18n.js";

export const Route = createFileRoute("/admin")({
  component: ClientLayout,
  head: () => {
    i18n.t("tradeIn");
    return {
      meta: [{ title: `${i18n.t("Dashboard")} - ` + "Trade In" }],
    };
  },
});

function ClientLayout() {
  const { t } = useTranslation();
  const matches = useMatches();
  const currentMatch = matches[matches.length - 1];
  const currentTitle = currentMatch?.meta?.[0]?.title?.split("-")[0];

  return (
    <>
      <SidebarProvider>
        <AppSidebar />
        <SidebarInset>
          <header className="flex h-16 shrink-0 items-center gap-2 transition-[width,height] ease-linear group-has-[[data-collapsible=icon]]/sidebar-wrapper:h-12">
            <div className="flex items-center gap-2 px-4">
              <SidebarTrigger className="-ml-1" />
              <Separator orientation="vertical" className="mr-2 h-4" />
              <Breadcrumb>
                <BreadcrumbList>
                  <BreadcrumbItem className="hidden md:block">
                    <BreadcrumbLink asChild>
                      <Link to="/">{t("tradeIn")}</Link>
                    </BreadcrumbLink>
                  </BreadcrumbItem>
                  <BreadcrumbSeparator className="hidden md:block" />
                  <BreadcrumbItem>
                    <BreadcrumbPage>{currentTitle}</BreadcrumbPage>
                  </BreadcrumbItem>
                </BreadcrumbList>
              </Breadcrumb>
            </div>
          </header>
          <div className="flex flex-1 flex-col gap-4 p-4 pt-0">
            <HeadContent />
            <Outlet />
          </div>
        </SidebarInset>
      </SidebarProvider>
    </>
  );
}
