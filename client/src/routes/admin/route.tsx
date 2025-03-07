import { createFileRoute, Outlet } from "@tanstack/react-router";
import { useTranslation } from "react-i18next";

export const Route = createFileRoute("/admin")({
  component: ClientLayout,
});

function ClientLayout() {
  const { t } = useTranslation();
  return (
    <div>
      <h1>Admin Layout</h1>
      <h4>{t("welcome")}</h4>
      <h4>{t("adminTest")}</h4>
      <div>
        <Outlet />
      </div>
    </div>
  );
}
