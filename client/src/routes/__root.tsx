import { createRootRouteWithContext, Outlet } from "@tanstack/react-router";
import { TanStackRouterDevtools } from "@tanstack/router-devtools";
import { AuthContext } from "../hooks/useAuth";

type RouterContext = {
  authentication: AuthContext;
};

export const Route = createRootRouteWithContext<RouterContext>()({
  component: () => {
    return (
      <div className="">
        <Outlet />
        <TanStackRouterDevtools />
      </div>
    );
  },
});
