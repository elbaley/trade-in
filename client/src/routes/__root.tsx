import { createRootRouteWithContext, Outlet } from "@tanstack/react-router";
import { TanStackRouterDevtools } from "@tanstack/router-devtools";
import { AuthContext } from "../hooks/useAuth";
import { QueryClient } from "@tanstack/react-query";

type RouterContext = {
  authentication: AuthContext;
  queryClient: QueryClient;
};

export const Route = createRootRouteWithContext<RouterContext>()({
  component: () => {
    return (
      <div className="">
        <Outlet />
        <TanStackRouterDevtools position="top-right" />
      </div>
    );
  },
});
