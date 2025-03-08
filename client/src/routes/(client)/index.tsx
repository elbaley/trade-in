import { createFileRoute } from "@tanstack/react-router";
import { Hero } from "@/components/core/hero";

export const Route = createFileRoute("/(client)/")({
  component: Index,
});

function Index() {
  return (
    <>
      <Hero />
    </>
  );
}
