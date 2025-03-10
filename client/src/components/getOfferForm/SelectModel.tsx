import { Spinner } from "../core/spinner";
import { ErrorAlert } from "../core/error-alert";
import { useTranslation } from "react-i18next";
import { useModels } from "@/hooks/useModels";
import { Option } from "../core/option";

type SelectModelProps = {
  companyId?: number | null;
  onSelectModel: (modelId: number) => void;
};
export const SelectModel = ({ companyId, onSelectModel }: SelectModelProps) => {
  const { t } = useTranslation();
  const { isLoading, data, isError } = useModels({ companyId });
  const models = data?.data;

  return (
    <div className="animate-slide-left">
      <h1 className=" mb-4 flex items-center gap-x-2 text-2xl sm:text-3xl font-medium lg:mb-5">
        {t("selectModel")}
      </h1>
      {isLoading ? <Spinner /> : null}
      {isError ? <ErrorAlert /> : null}

      {models && (
        <div className="flex flex-col gap-4  justify-start">
          {models.map((model) => (
            <Option
              key={model.id}
              label={model.name}
              onClick={() => {
                onSelectModel(model.id);
              }}
            />
          ))}
        </div>
      )}
    </div>
  );
};
