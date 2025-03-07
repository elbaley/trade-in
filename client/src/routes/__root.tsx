import { createRootRoute, Outlet } from "@tanstack/react-router";
import { TanStackRouterDevtools } from "@tanstack/router-devtools";
import { LanguageSwitcher } from "@/components/LanguageSwitcher";

export const Route = createRootRoute({
  component: () => {
    return (
      <>
        <LanguageSwitcher />
        <Outlet />
        <TanStackRouterDevtools />
      </>
    );
  },
});
