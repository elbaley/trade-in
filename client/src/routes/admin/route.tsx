import { createFileRoute, Outlet } from "@tanstack/react-router";

export const Route = createFileRoute("/admin")({
  component: ClientLayout,
});

function ClientLayout() {
  return (
    <div>
      <h1>Admin Layout</h1>
      <div>
        <Outlet />
      </div>
    </div>
  );
}
