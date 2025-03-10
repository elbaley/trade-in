import { Button } from "@/components/ui/button";
import { useAuth } from "@/hooks/useAuth";
import { createFileRoute, Outlet, useRouter } from "@tanstack/react-router";
import { useTranslation } from "react-i18next";

export const Route = createFileRoute("/admin")({
  component: ClientLayout,
});

function ClientLayout() {
  const { t } = useTranslation();
  const { navigate } = useRouter();
  const { signOut } = useAuth(navigate);
  return (
    <div>
      <h1>Admin Layout</h1>
      <Button
        onClick={() => {
          signOut();
        }}
        variant={"destructive"}
      >
        {t("logout")}
      </Button>
      <h4>{t("welcome")}</h4>
      <h4>{t("adminTest")}</h4>
      <div>
        <Outlet />
      </div>
    </div>
  );
}
