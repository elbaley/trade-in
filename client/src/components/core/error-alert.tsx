import { AlertCircle } from "lucide-react";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { useTranslation } from "react-i18next";

type ErrorAlertProps = {
  title?: string;
  message?: string;
};
export const ErrorAlert = ({ title, message }: ErrorAlertProps) => {
  const { t } = useTranslation();
  return (
    <Alert className="animate-shake" variant="destructive">
      <AlertCircle className="h-4 w-4" />
      <AlertTitle>{title ? title : t("error")}</AlertTitle>
      <AlertDescription>
        {message ? message : t("genericError")}
      </AlertDescription>
    </Alert>
  );
};
