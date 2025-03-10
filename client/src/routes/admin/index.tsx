import { createFileRoute, redirect } from "@tanstack/react-router";

export const Route = createFileRoute("/admin/")({
  beforeLoad: ({ context }) => {
    const { isLogged } = context.authentication;
    if (!isLogged) {
      throw redirect({ to: "/" });
    }
  },
  component: RouteComponent,
});

function RouteComponent() {
  return <h2>Admin</h2>;
}
