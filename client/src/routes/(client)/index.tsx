import { useTranslation } from "react-i18next";
import { createFileRoute } from "@tanstack/react-router";

export const Route = createFileRoute("/(client)/")({
  component: Index,
});

function Index() {
  const { t } = useTranslation();
  return (
    <div className="p-2">
      <h2>Home</h2>
      <h3>{t("welcome")}</h3>
    </div>
  );
}
