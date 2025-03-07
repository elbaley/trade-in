import { createFileRoute, Link, Outlet } from "@tanstack/react-router";

export const Route = createFileRoute("/(client)")({
  component: ClientLayout,
});

function ClientLayout() {
  return (
    <div>
      <div className="p-2 flex gap-4">
        <Link to="/" className="[&.active]:font-bold">
          Home
        </Link>{" "}
        <Link to="/admin" className="[&.active]:font-bold">
          Admin
        </Link>
      </div>
      <hr />
      <h1>Client Layout</h1>
      <div>
        <Outlet />
      </div>
    </div>
  );
}
