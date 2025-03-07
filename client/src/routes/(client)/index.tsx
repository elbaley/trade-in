import { createFileRoute } from "@tanstack/react-router";

export const Route = createFileRoute("/(client)/")({
  component: Index,
});

function Index() {
  return (
    <div className="p-2">
      <h2>Home</h2>
    </div>
  );
}
